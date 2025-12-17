import useNavigate from '@/hooks/useNavigate';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useProfile } from '@/store/profile/useProfile';
import { ROUTE_PATH } from '@/utils/const';
import { Button, Progress } from '@nextui-org/react';
import { useDebounce } from 'ahooks';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { isMobile } from 'react-device-detect';
import { useGetListMyCourse } from '../Course/ListCourse/service';
import { useQueryClient } from '@tanstack/react-query';
import ModalConfirmDelete from '../Course/ModalConfirmDelete';
import CustomButtonNewCourse from '../UI/CustomButtonNewCourse';
import InputText from '../UI/InputText';
import Loading from '../UI/Loading';
import SelectCustom from '../UI/SelectCustom';
import Text from '../UI/Text';
import NoData from './NoData';
import Link from 'next/link';
import ImageCustom from '@/components/UI/ImageCustom';
import { API_PATH } from '@/api/constant';
import { PREFIX_API } from '@/api/request';
import { toast } from '@/components/UI/Toast/toast';
const ListCourse = () => {
  const { t } = useTranslation('common');

  const SORT_BY = [
    { key: 'createdAt desc', label: t('listCourse.newest') },
    { key: 'createdAt asc', label: t('listCourse.oldest') },
  ];

  const [sort, setSort] = useState('createdAt desc');
  const [search, setSearch] = useState('');
  const { navigate } = useNavigate();

  const debounceValue = useDebounce(search, { wait: 500 });
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  
  // Memoize params to prevent unnecessary re-renders
  const queryParams = useMemo(() => ({
    order: sort,
    search: debounceValue || '',
    pageSize: 5,
    page: 1, // initial page for infinite query
  }), [sort, debounceValue]);
  
  const { dataCourses, reload, loading, loadMore, loadingMore, noMore } = useGetListMyCourse(queryParams);
  const { profile } = useProfile();
  const accessToken = useAccessToken();

  const refModalConfirmDelete: any = useRef<any>(null);

  useEffect(() => {
    if (!loadMoreRef.current || noMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loadingMore && !loading && !noMore) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loadMoreRef, loadMore, loadingMore, loading, noMore]);

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const deleteCourse = (id: string) => {
    refModalConfirmDelete.current.onOpen(id);
  };

  const handleTogglePublish = async (course: any, canToggle: boolean) => {
    if (!canToggle || updatingCourseId) return;
    if (!accessToken) {
      toast.error('Please login before updating course.');
      return;
    }

    try {
      setUpdatingCourseId(course.id);
      const response = await fetch(`${PREFIX_API}${API_PATH.EDIT_COURSE(course.id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ isPublish: !course.isPublish }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.message || 'Failed to update course');
      }

      toast.success(
        !course.isPublish ? 'Course published successfully.' : 'Course set to draft successfully.'
      );
      
      // Optimistically update React Query cache instead of local state
      queryClient.setQueryData(['myCourses', queryParams, profile?.id], (oldData: any) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data?.map((c: any) =>
              c.id === course.id ? { ...c, isPublish: !course.isPublish } : c
            ),
          })),
        };
      });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update course');
    } finally {
      setUpdatingCourseId(null);
    }
  };

  // Use dataCourses directly instead of intermediate state to avoid unnecessary re-renders
  const computedCourses = useMemo(() => {
    if (!dataCourses || dataCourses.length === 0) return [];
    return dataCourses.map((item: any) => {
      const isEnoughIntendedLearners =
        item?.objectives?.length > 0 &&
        item?.intenedLeaners?.length > 0 &&
        item?.requirements?.length > 0
          ? 1
          : 0;

      const isEnoughCourseLangdingePage =
        item?.title && item?.categoryId && item?.level && item?.lang ? 1 : 0;

      const isEnoughSetPrice = item?.originPrice && item?.price ? 1 : 0;

      const allLessonsHaveContent =
        Array.isArray(item?.sections) &&
        item?.sections?.length > 0 &&
        item?.sections?.every((section: any) => {
          if (section?.lessons?.length === 0) {
            return section?.quizzes?.length > 0;
          }

          return section?.lessons?.every(
            (lesson: any) =>lesson?.id && lesson.content
          );
        });

      const allQuizzesHaveQuestions =
        Array.isArray(item?.sections) &&
        item?.sections?.length > 0 &&
        item?.sections?.every((section: any) => {
          if (section?.quizzes?.length === 0) {
            return section?.lessons?.length > 0;
          }

          return section?.quizzes?.every(
            (quizz: any) =>
              (quizz?.id && quizz.sectionId)
          )
        });

      const isEnoughCurruclum =
        allLessonsHaveContent && allQuizzesHaveQuestions ? 1 : 0;
      const totalProgress =
        isEnoughCurruclum +
        isEnoughSetPrice +
        isEnoughIntendedLearners +
        isEnoughCourseLangdingePage;
      const statusLabel = item?.isPublish
        ? t('listCourse.public')
        : t('listCourse.draft');
      const progressPercent = Math.round((totalProgress / 4) * 100);
      const canAction = Boolean(
        isEnoughCurruclum &&
          isEnoughSetPrice &&
          isEnoughIntendedLearners &&
          isEnoughCourseLangdingePage
      );

      return {
        item,
        totalProgress,
        progressPercent,
        statusLabel,
        canAction,
      };
    });
  }, [dataCourses, t]);

  return (
    <div className="flex flex-col gap-[50px]">
      <div className="flex flex-col gap-[30px]">
        <div className="flex items-center justify-between">
          <div className="pl-5 border-l-4 border-l-main">
            <Text type="font-28-700">{t('navigation.courses')}</Text>
          </div>
          {isMobile && (
            <CustomButtonNewCourse
              handleClickButton={() => {
                navigate(ROUTE_PATH.CREATE_COURSE);
              }}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 w-full">
            <div>
              <InputText
                startContent={<IconSearch />}
                className="min-w-[240px] md:min-w-[302px]"
                isInputSubmit
                placeholder={t('common.search')}
                value={search}
                onChange={handleChange}
              />
            </div>
            <SelectCustom
              placeholder={t('listCourse.sortBy')}
              isSelectSubmit
              className="w-full md:min-w-[120px] md:max-w-[140px] min-h-[44px] !bg-black-30"
              options={SORT_BY}
              value={sort}
              onChange={(value: any) => {
                setSort(value.target.value);
              }}
            />
          </div>
          <div className="hidden md:block">
            <CustomButtonNewCourse
              handleClickButton={() => {
                navigate(ROUTE_PATH.CREATE_COURSE);
              }}
            />
          </div>
        </div>
      </div>

      {loading ? <Loading /> : (
        <>
          {computedCourses?.length > 0 &&
            computedCourses.map(
              ({ item, totalProgress, progressPercent, statusLabel, canAction }) => (
                <div
                  key={item?.id}
                  className="relative group cursor-pointer"
                >
                  <div className="bg-gray-70 rounded-xl border border-[#F0F0F01A] transition-all duration-300 hover:border-main overflow-hidden">
                    <div className="flex items-center gap-6 p-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-48 h-36 md:w-64 md:h-40 rounded-lg overflow-hidden bg-black">
                          <ImageCustom
                            alt=""
                            src={item?.image || '/img-course.png'}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div
                          className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                        >
                          <div className="h-full flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-2 p-2">
                              <button
                                onClick={() => navigate(`${ROUTE_PATH.CREATE_COURSE}/${item?.id}`)}
                                className="p-2 text-white rounded-lg transition-all hover:scale-110 bg-gray-10 bg-opacity-20 hover:bg-opacity-30"
                              >
                                <IconEdit />
                              </button>
                              <button
                                onClick={() => navigate(`${ROUTE_PATH.COURSE_STATISTIC}/${item?.id}`)}
                                className="p-2 text-white rounded-lg transition-all hover:scale-110 bg-gray-10 bg-opacity-20 hover:bg-opacity-30"
                              >
                                <IconStatistic />
                              </button>
                              <button
                                onClick={() => handleTogglePublish(item, canAction)}
                                disabled={!canAction || updatingCourseId === item?.id}
                                className={clsx(
                                  'p-2 text-white rounded-lg transition-all',
                                  {
                                    'bg-gray-10 bg-opacity-20 hover:bg-opacity-30 hover:scale-110':
                                      canAction && updatingCourseId !== item?.id,
                                    'bg-gray-500 bg-opacity-10 opacity-50 cursor-not-allowed':
                                      !canAction || updatingCourseId === item?.id,
                                  }
                                )}
                                title={!canAction ? t('listCourse.completeToEnable') : ''}
                              >
                                {item?.isPublish ? <Eye /> : <EyeOff />}
                              </button>
                              <button
                                onClick={() => deleteCourse(item.id)}
                                className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-all hover:scale-110"
                              >
                                <IconDelete />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-letter font-semibold text-xl flex-1 mr-4 line-clamp-2">
                            {item?.title}
                          </h3>
                          <span
                            className={clsx(
                              'px-3 py-1 rounded-full text-md font-semibold whitespace-nowrap',
                              {
                                'bg-main text-white': item?.isPublish,
                                'bg-yellow-500 text-gray-900': !item?.isPublish,
                              }
                            )}
                          >
                            {statusLabel}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-300 text-md">{t('listCourse.progress')}</span>
                              <span
                                className={clsx('text-md font-bold', {
                                  'text-green-400': totalProgress === 4,
                                  'text-main': totalProgress !== 4,
                                })}
                              >
                                {progressPercent}%
                              </span>
                            </div>
                            <Progress
                              maxValue={4}
                              classNames={{
                                indicator: 'bg-main',
                                track: 'max-h-[8px]',
                              }}
                              className="w-full"
                              value={totalProgress}
                            />
                          </div>

                          <div className="flex items-center justify-end gap-3">
                            <span className="text-gray-300 text-lg">{t('listCourse.status')}</span>
                            <div
                              className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-lg', {
                                'bg-black-10': !item?.isPublish,
                              })}
                            >
                              <div
                                className={clsx('w-2 h-2 rounded-full', {
                                  'bg-main': item?.isPublish,
                                  'bg-gray-10': !item?.isPublish,
                                })}
                              ></div>
                              <span
                                className={clsx('text-md font-medium', {
                                  'text-main': item?.isPublish,
                                  'text-gray-20': !item?.isPublish,
                                })}
                              >
                                {item?.isPublish ? t('listCourse.enabled') : t('listCourse.disabled')}
                              </span>
                              {!canAction && (
                                <span className="text-xs text-yellow-500 ml-1">
                                  {t('listCourse.completeToEnable')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

          {computedCourses?.length === 0 && <NoData />}

          {/* Infinite scroll sentinel */}
          {computedCourses?.length > 0 && !noMore && (
            <div
              ref={loadMoreRef}
              className="flex justify-center items-center py-4 text-gray-300 text-sm"
            >
              <Loading />
            </div>
          )}
        </>
      )}
      <ModalConfirmDelete ref={refModalConfirmDelete} reload={reload} />
    </div>
  );
};
export default ListCourse;
const IconEdit = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6.414 16.0001L16.556 5.85808L15.142 4.44408L5 14.5861V16.0001H6.414ZM7.243 18.0001H3V13.7571L14.435 2.32208C14.6225 2.13461 14.8768 2.0293 15.142 2.0293C15.4072 2.0293 15.6615 2.13461 15.849 2.32208L18.678 5.15108C18.8655 5.33861 18.9708 5.59292 18.9708 5.85808C18.9708 6.12325 18.8655 6.37756 18.678 6.56508L7.243 18.0001ZM3 20.0001H21V22.0001H3V20.0001Z"
        fill="var(--theme-letter)"
      />
    </svg>
  );
};
const IconDelete = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_795_5780)">
        <path
          d="M4 8H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V8ZM6 10V20H18V10H6ZM9 12H11V18H9V12ZM13 12H15V18H13V12ZM7 5V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H16C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9Z"
          fill="var(--theme-letter)"
        />
      </g>
      <defs>
        <clipPath id="clip0_795_5780">
          <rect width="24" height="24" fill="var(--theme-letter)" />
        </clipPath>
      </defs>
    </svg>
  );
};
const IconStatistic = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3ZM4 5V19H20V5H4ZM8 11H10V17H8V11ZM12 7H14V17H12V7ZM16 13H18V17H16V13Z"
        fill="var(--theme-letter)"
      />
    </svg>
  );
};
const Eye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
    <path
      d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5a5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z"
      fill="currentColor"
    />
  </svg>
);

const EyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
    <path
      d="M12 7a5 5 0 013.535 8.536l2.121 2.121A11.983 11.983 0 0023 12c-1.73-3.89-6-7-11-7a10.96 10.96 0 00-4.243.848l2.26 2.26A4.98 4.98 0 0112 7zm-8.485-4.071l2.242 2.242L6.22 7.634C3.723 8.883 1.97 10.744 1 12c1.73 3.89 6 7 11 7 1.522 0 2.985-.293 4.332-.836l2.153 2.153 1.414-1.414-16.97-16.97-1.414 1.414zm8.485 14.071a5 5 0 01-5-5 4.98 4.98 0 012.02-4.006l1.514 1.514A3 3 0 0011 12a3 3 0 003 3c.195 0 .384-.02.567-.058l1.863 1.863A7.02 7.02 0 0112 17z"
      fill="currentColor"
    />
  </svg>
);
const IconSearch = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18.031 16.617L22.314 20.899L20.899 22.314L16.617 18.031C15.0237 19.3082 13.042 20.0029 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20.0029 13.042 19.3082 15.0237 18.031 16.617ZM16.025 15.875C17.2941 14.5699 18.0029 12.8204 18 11C18 7.132 14.867 4 11 4C7.132 4 4 7.132 4 11C4 14.867 7.132 18 11 18C12.8204 18.0029 14.5699 17.2941 15.875 16.025L16.025 15.875Z"
        fill="var(--theme-gray-30)"
      />
    </svg>
  );
};

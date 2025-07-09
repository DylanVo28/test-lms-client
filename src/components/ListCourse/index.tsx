import useNavigate from '@/hooks/useNavigate';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useProfile } from '@/store/profile/useProfile';
import { ROUTE_PATH } from '@/utils/const';
import { Button, Progress } from '@nextui-org/react';
import { useDebounce } from 'ahooks';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useGetListMyCourse } from '../Course/ListCourse/service';
import ModalConfirmDelete from '../Course/ModalConfirmDelete';
import CustomButtonNewCourse from '../UI/CustomButtonNewCourse';
import InputText from '../UI/InputText';
import Loading from '../UI/Loading';
import SelectCustom from '../UI/SelectCustom';
import Text from '../UI/Text';
import NoData from './NoData';
import { getAccessToken } from '@/store/auth';
import Link from 'next/link';
const ListCourse = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const SORT_BY = [
    { key: 'createdAt desc', label: t('Newest') },
    { key: 'createdAt asc', label: t('Oldest') },
  ];

  const [sort, setSort] = useState('createdAt desc');
  const [search, setSearch] = useState('');
  const [debounceVal, setDebounceVal] = useState('');
  const { navigate } = useNavigate();

  const debounceValue = useDebounce(search, { wait: 500 });
  const [idHovered, setIdHovered] = useState<string>('');
  const { dataCourses, reload, loading, loadingMore } = useGetListMyCourse({
    order: sort,
    search: debounceVal,
  });
  const { profile } = useProfile();

  const refModalConfirmDelete: any = useRef<any>(null);

  useEffect(() => {
    setDebounceVal(search);
  }, [debounceValue]);

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const handleMouseEnter = (id: string) => {
    setIdHovered(id);
  };

  const handleMouseLeave = () => {
    setIdHovered('');
  };

  const deleteCourse = (id: string) => {
    refModalConfirmDelete.current.onOpen(id);
  };

  useEffect(() => {
    if (profile?.id) {
      reload();
    }
  }, [sort, debounceVal, profile?.id]);

  return (
    <div className="flex flex-col gap-[50px]">
      <div className="flex flex-col gap-[30px]">
        <div className="flex items-center justify-between">
          <div className="pl-5 border-l-4 border-l-main">
            <Text type="font-28-700">{t('Courses')}</Text>
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
                placeholder={t('Search')}
                value={search}
                onChange={handleChange}
              />
            </div>
            <SelectCustom
              placeholder={t('Sort by type')}
              isSelectSubmit
              className="w-full md:min-w-[120px] md:max-w-[140px] min-h-[44px] !bg-black-30"
              options={SORT_BY}
              value={sort}
              onChange={(value: any) => {
                console.log('valueeee', value.target.value);
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

      {!loading && (
        <>
          {dataCourses?.length > 0 &&
            dataCourses?.map((item: any) => {
              console.log(item, 'item');

              const isEnoughIntendedLearners =
                item?.objectives?.length > 0 &&
                item?.intenedLeaners?.length > 0 &&
                item?.requirements?.length > 0
                  ? 1
                  : 0;

              const isEnoughCourseLangdingePage =
                item?.title && item?.categoryId && item?.level && item?.lang
                  ? 1
                  : 0;

              const isEnoughSetPrice = item?.originPrice && item?.price ? 1 : 0;

              const allLessonsHaveContent =
                Array.isArray(item?.sections) &&
                item?.sections?.length > 0 &&
                item?.sections?.every((section: any) => {
                  if (section?.lessons?.length === 0) {
                    return section?.quizzes?.length > 0;
                  }

                  return section?.lessons?.every(
                    (lesson: any) =>
                      (lesson?.id &&
                        (!!lesson?.content || !!lesson?.info?.thumbnailUrl)) ||
                      !lesson?.id
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
                      (quizz?.id &&
                        Array.isArray(quizz?.questions) &&
                        quizz?.questions?.length > 0) ||
                      !quizz.id
                  );
                });

              const isEnoughCurruclum =
                allLessonsHaveContent && allQuizzesHaveQuestions ? 1 : 0;

              const totalProgress =
                isEnoughCurruclum +
                isEnoughSetPrice +
                isEnoughIntendedLearners +
                isEnoughCourseLangdingePage;

              return (
                <div key={item?.id} className="flex flex-col gap-4">
                  <div
                    onMouseEnter={() => handleMouseEnter(item?.id)}
                    onMouseLeave={handleMouseLeave}
                    className="rounded cursor-pointer transition-all flex flex-col md:flex-row w-full min-h-[202px] border-1 border-[#F0F0F01A] bg-gray-70"
                  >
                    <div className="h-full bg-white">
                      <Image
                        alt=""
                        src={item.image || '/img-course.png'}
                        width={300}
                        height={200}
                        className="h-[200px] w-[300px]  mx-auto md:mx-0 object-contain bg-black"
                      />
                    </div>

                    <div className="flex-1 p-4 flex flex-col gap-4 md:gap-0 relative justify-between w-full">
                      {idHovered === item?.id && (
                        <div className="absolute inset-0 bg-black-40 bg-blur-custom z-50 h-full">
                          <div className="flex flex-row items-center gap-4 justify-center h-full">
                            <Link
                              className="flex gap-2 justify-center items-center z-[1000]"
                              href={`${window.location.origin}/${router.query.code}/${ROUTE_PATH.CREATE_COURSE}/${item?.id}`}
                              rel="noopener noreferrer"
                            >
                              <IconEdit />
                              <Text className="text-[20px] font-bold text-white">
                                {t('Edit Course')}
                              </Text>
                            </Link>
                            <div
                              className="flex gap-2 justify-center items-center z-[1000]"
                              onClick={() => deleteCourse(item.id)}
                            >
                              <IconDelete />
                              <Text className="text-[20px] font-bold text-white">
                                {t('Delete Course')}
                              </Text>
                            </div>
                            <Link
                              className="flex gap-2 justify-center items-center z-[1000]"
                              href={`${window.location.origin}/${router.query.code}/${ROUTE_PATH.COURSE_STATISTIC}/${item?.id}`}
                              rel="noopener noreferrer"
                            >
                              <IconStatistic />
                              <Text className="text-[20px] font-bold text-white">
                                {t('View Statistics')}
                              </Text>
                            </Link>
                          </div>
                        </div>
                      )}
                      <Text className="text-[16px] md:text-[20px] font-bold">
                        {item?.title}
                      </Text>
                      <div className="flex md:justify-end md:items-end">
                        <div className="flex items-center w-full md:w-8/12 gap-4">
                          <Text className="text-[16px] md:text-[20px] font-bold w-[300px] md:w-[270px] whitespace-nowrap">
                            {t('Finish your courses')}
                          </Text>
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
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-[30px]">
                          {!item?.isPublish && (
                            <Text type={'font-16-700'} className="text-white">
                              {t('Draft')}
                            </Text>
                          )}

                          {item?.isPublish && (
                            <Text type={'font-16-700'} className="text-white">
                              {t('Public')}
                            </Text>
                          )}
                        </div>
                        {isMobile && (
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`${window.location.origin}/${router.query.code}/${ROUTE_PATH.CREATE_COURSE}/${item?.id}`}
                              className="bg-black-9 rounded-full"
                            >
                              <IconEdit />
                            </Link>
                            <Button
                              isIconOnly
                              size="lg"
                              onPress={() => deleteCourse(item.id)}
                              className="bg-black-9 rounded-full"
                            >
                              <IconDelete />
                            </Button>
                            <Link
                              href={`${window.location.origin}/${router.query.code}/${ROUTE_PATH.COURSE_STATISTIC}/${item?.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-black-9 rounded-full"
                            >
                              <IconStatistic />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {dataCourses?.length === 0 && <NoData />}
        </>
      )}
      {loading && <Loading />}
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
        fill="var(--theme-white)"
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
      <g clip-path="url(#clip0_795_5780)">
        <path
          d="M4 8H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V8ZM6 10V20H18V10H6ZM9 12H11V18H9V12ZM13 12H15V18H13V12ZM7 5V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H16C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9Z"
          fill="var(--theme-white)"
        />
      </g>
      <defs>
        <clipPath id="clip0_795_5780">
          <rect width="24" height="24" fill="var(--theme-white)" />
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
        fill="var(--theme-white)"
      />
    </svg>
  );
};
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

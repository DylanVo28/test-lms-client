import Text from '@/components/UI/Text';
import BreadCrumbs from './BreadCrumbs';
import Rater from 'react-rater';
import IconBookMark from '@/components/UI/Icons/IconBookMark';
import IconStudent from '@/components/UI/Icons/IconStudent';
import IconTimeNew from '@/components/UI/Icons/IconTimeNew';
import Image from 'next/image';
import YouLearn from './YouLearn';
import Requirements from './Requirements';
import About from './About';
import { Button } from '@nextui-org/react';
import Mentors from './Mentors';
import MoreCourse from './MoreCourse';
import CardEnrollNow from './CardEnrollNow';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useGetDetailCourse } from '@/components/CreateCourse/service';
import dayjs from 'dayjs';
import { clean, formatWalletAddress, getAvatar } from '@/utils/common';
import LoadingScreen from '@/components/UI/LoadingScreen';
import { useProfile } from '@/store/profile/useProfile';
import User from '@/components/UI/Icons/User';
import { useTranslation } from 'next-i18next';
import {
  useLikeCourse,
  useUnLikeCourse,
} from '@/components/CourseSearch/service';

const DetailCourse = () => {
  const router = useRouter();
  const { profile } = useProfile();
  const { t } = useTranslation('common');
  const {
    run: getDetailCourse,
    data: dataDetail,
    loading,
    mutate,
  } = useGetDetailCourse({
    // pollingInterval: 5000,
    onSuccess: () => {
      // handleScrollTop();
    },
  });

  useEffect(() => {
    if (router.query.id) {
      getDetailCourse(router.query.id as string, profile?.id);
    }
  }, [router.query.id, profile?.id]);

  const lessonCount = dataDetail?.data?.sections?.reduce(
    (total: number, section: any) => {
      return total + (section.lessons?.length || 0);
    },
    0
  );

  const handleScrollTop = () => {
    const element: any = document.querySelector('#top');

    if (element) {
      element.style.scrollMarginTop = '120px';

      element.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        element.style.scrollMarginTop = '0';
      }, 1000);
    }
  };

  const { run: runLikeCourse } = useLikeCourse({
    onSuccess(res) {
      mutate({
        ...dataDetail,
        data: {
          ...dataDetail?.data,
          liked: true,
        },
      });
    },
  });

  const { run: runUnLikeCourse } = useUnLikeCourse({
    onSuccess(res) {
      mutate({
        ...dataDetail,
        data: {
          ...dataDetail?.data,
          liked: false,
        },
      });
    },
  });

  const mapCategoryCourse = () => {
    if (!dataDetail?.data) return '';
    const catRelated = [
      dataDetail?.data?.category?.name,
      dataDetail?.data?.subCategory?.name,
    ];
    const cleanArr = clean(catRelated);

    return cleanArr.join(' | ');
  };

  const generateMentors = () => {
    if (dataDetail?.data?.author?.fullName) {
      return dataDetail?.data?.author?.fullName;
    }
    return formatWalletAddress(dataDetail?.data?.author?.walletAddress);
  };

  const handleLike = (id: string) => {
    runLikeCourse(id);
  };
  const handleUnLike = (id: string) => {
    runUnLikeCourse(id);
  };
  return (
    <LoadingScreen isLoading={false}>
      <div
        id="top"
        className="flex flex-col gap-4 lg:gap-[30px] relative px-4 lg:px-0"
      >
        <BreadCrumbs />
        <div className="lg:grid lg:grid-cols-10 lg:gap-[70px]">
          {/* Mobile Card - Show at top on mobile */}
          <div className="block mb-6 lg:hidden">
            <CardEnrollNow course={dataDetail?.data} isLoading={loading} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-7 flex flex-col gap-4 lg:gap-5">
            {/* Course Header */}
            <div className="flex flex-col border-b-1 border-b-black-10 pb-4 lg:pb-5 gap-3 lg:gap-5">
              <Text
                type="font-28-700"
                className="text-letter text-xl lg:text-3xl leading-tight"
              >
                {dataDetail?.data?.title}
              </Text>
              <Text type="font-14-400" className="text-letter">
                {t('course.learn')}: {mapCategoryCourse()}
              </Text>

              {/* Course Stats - Stack on mobile, row on desktop */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-2">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Text type="font-14-400" className="text-letter">
                    {(dataDetail?.data?.rating || 5)?.toFixed(1)}
                  </Text>
                  <Rater total={5} rating={dataDetail?.data?.rating || 5} />
                </div>

                {/* Separator - Desktop only */}
                <div className="w-[1px] hidden lg:block h-5 bg-[#BFBFBF]" />

                {/* Lessons Count */}
                {lessonCount && (
                  <>
                    <div className="flex items-center gap-1">
                      <IconBookMark />
                      <Text type="font-14-400" className="text-letter">
                        {lessonCount || 0}{' '}
                        {t(
                          lessonCount === 1 ? 'course.lesson' : 'course.lessons'
                        )}
                      </Text>
                    </div>
                    <div className="w-[1px] hidden lg:block h-5 bg-[#BFBFBF]" />
                  </>
                )}

                {/* Students Count */}
                {dataDetail?.data?.userCourses?.length > 0 && (
                  <>
                    <div className="flex items-center gap-1">
                      <IconStudent />
                      <Text type="font-14-400" className="text-letter">
                        {dataDetail?.data?.userCourses.length}{' '}
                        {t('course.students')}
                      </Text>
                    </div>
                    <div className="w-[1px] hidden lg:block h-5 bg-[#BFBFBF]" />
                  </>
                )}

                {/* Last Updated */}
                <div className="flex items-center gap-1">
                  <IconTimeNew />
                  <Text type="font-14-400" className="text-letter">
                    {t('course.lastUpdated', {
                      date: dayjs(dataDetail?.data?.updatedAt).format(
                        'MM/YYYY'
                      ),
                    })}
                  </Text>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-[6px]">
                {dataDetail?.data?.author?.avatar ? (
                  <Image
                    alt=""
                    src={
                      dataDetail?.data?.author?.avatar ||
                      '/images/user-line.png'
                    }
                    width={24}
                    height={24}
                    className="rounded-full w-6 h-6 flex-shrink-0"
                    onError={(e: any) => {
                      e.target.srcset = '/images/user-line.png';
                    }}
                  />
                ) : (
                  <User size={18} className="flex-shrink-0" />
                )}

                <Text type="font-15-500" className="text-main">
                  {t('course.by')}
                </Text>
                <Text
                  element="span"
                  type="font-15-500"
                  className="text-letter truncate"
                >
                  {generateMentors()}
                </Text>
              </div>
            </div>

            {/* Course Sections */}
            <div className="flex flex-col gap-4 lg:gap-5">
              <YouLearn data={dataDetail?.data} />
              <Requirements data={dataDetail?.data} />
              <About data={dataDetail?.data} />
              <Mentors mentor={dataDetail?.data?.author} />
              <MoreCourse
                courseId={dataDetail?.data?.id}
                author={dataDetail?.data?.author}
              />
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-28 z-[40]">
              <CardEnrollNow
                handleUnLike={handleUnLike}
                handleLike={handleLike}
                course={dataDetail?.data}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </LoadingScreen>
  );
};
export default DetailCourse;

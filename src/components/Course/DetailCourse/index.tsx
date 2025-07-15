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
import { User } from '@phosphor-icons/react';
import {
  useLikeCourse,
  useUnLikeCourse,
} from '@/components/CourseSearch/service';

const DetailCourse = () => {
  const router = useRouter();
  const { profile } = useProfile();
  const {
    run: getDetailCourse,
    data: dataDetail,
    loading,
    mutate,
  } = useGetDetailCourse({
    pollingInterval: 5000,
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
      <div id="top" className="flex flex-col gap-[20px] md:gap-[30px] relative">
        <BreadCrumbs />
        <div className="md:grid md:grid-cols-10 gap-[70px]">
          <div className="block mb-4 md:hidden">
            <CardEnrollNow course={dataDetail?.data} isLoading={loading} />
          </div>
          <div className="col-span-7 flex flex-col gap-5">
            <div className="flex flex-col border-b-1 border-b-black-10 pb-5 gap-5">
              <Text type="font-28-700" className="text-white">
                {dataDetail?.data?.title}
              </Text>
              <Text type="font-14-400" className="text-white">
                Learn: {mapCategoryCourse()}
              </Text>
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2">
                <div className="flex items-center gap-2">
                  <Text type="font-14-400" className="text-white">
                    {(dataDetail?.data?.rating || 5)?.toFixed(1)}
                  </Text>
                  <Rater total={5} rating={dataDetail?.data?.rating || 5} />
                </div>

                <div className="w-[1px] hidden md:block h-5 bg-[#BFBFBF]" />
                {lessonCount && (
                  <>
                    <div className="flex items-center gap-1">
                      <IconBookMark />
                      <Text type="font-14-400" className="text-white">
                        {lessonCount || 0} Lessons
                      </Text>
                    </div>
                    <div className="w-[1px] hidden md:block h-5 bg-[#BFBFBF]" />
                  </>
                )}
                {dataDetail?.data?.userCourses?.length > 0 && (
                  <>
                    <div className="flex items-center gap-1">
                      <IconStudent />
                      <Text type="font-14-400" className="text-white">
                        {dataDetail?.data?.userCourses.length} Students
                      </Text>
                    </div>
                    <div className="w-[1px] hidden md:block h-5 bg-[#BFBFBF]" />
                  </>
                )}

                <div className="flex items-center gap-1">
                  <IconTimeNew />
                  <Text type="font-14-400" className="text-white">
                    {`Last updated ${dayjs(dataDetail?.data?.updatedAt).format(
                      'MM/YYYY'
                    )}`}
                  </Text>
                </div>
              </div>

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
                    className="rounded-full w-6 h-6"
                    onError={(e: any) => {
                      e.target.srcset = '/images/user-line.png';
                    }}
                  />
                ) : (
                  <User size={18} />
                )}

                <Text type="font-15-500" className="text-main">
                  By
                </Text>
                <Text
                  element="span"
                  type="font-15-500"
                  className="text-white truncate w-full"
                >
                  {generateMentors()}
                </Text>
              </div>
            </div>
            <YouLearn data={dataDetail?.data} />
            <Requirements data={dataDetail?.data} />
            <About data={dataDetail?.data} />
            <Mentors mentor={dataDetail?.data?.author} />
            <MoreCourse
              courseId={dataDetail?.data?.id}
              author={dataDetail?.data?.author}
            />
          </div>
          <div className="col-span-3 hidden md:block">
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

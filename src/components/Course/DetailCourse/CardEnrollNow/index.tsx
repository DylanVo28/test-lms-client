import IconDate from '@/components/UI/Icons/IconDate';
import IconTime from '@/components/UI/Icons/IconTime';
import RateStar from '@/components/UI/RateStar';
import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import { Button, Modal, ModalContent, ModalBody } from '@nextui-org/react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useEnrollCourse } from './service';
import { getAccessToken } from '@/store/auth';
import CustomButtonEnroll from '@/components/UI/CustomButtonEnroll';
import { useProfile } from '@/store/profile/useProfile';
import { useTranslation } from 'next-i18next';
import useNavigate from '@/hooks/useNavigate';
import { toast } from '@/components/UI/Toast/toast';
import { error } from 'console';
import { formatNumber, formatPrice } from '@/utils/common';
import IconLikedCourse from '@/components/UI/Icons/IconLikedCourse';
import IconLikeCourse from '@/components/UI/IconLikeCourse';
import ModalViewVideo from './ModalViewVideo';

const CardEnrollNow = ({
  course,
  handleLike,
  handleUnLike,
}: {
  course: any;
  handleLike?: (id: string) => void;
  handleUnLike?: (id: string) => void;
}) => {
  console.log(course, 'course');
  const { t } = useTranslation('common');

  const DATA_NOTE = [
    t('12 hours of on-demand video'),
    t('Exercises'),
    t('1 downloadable resource'),
    t('Mobile and TV access'),
    t('Timed access'),
    t('Certificate of completion'),
  ];

  const token = getAccessToken();
  const { profile } = useProfile();
  const { navigate } = useNavigate();

  const refModalViewVideo: any = useRef(null);

  const { run, loading } = useEnrollCourse({
    onSuccess: (res) => {
      console.log(res, 'res123');

      if (res?.data?.courseId) {
        navigate(ROUTE_PATH.DETAIL_LESSON(res?.data?.courseId));
      }
    },
    onError: (err) => {
      toast.error(err?.message);
    },
  });
  const discountCalculator = (originPrice: any, price: any) => {
    const discountPercentage = ((originPrice - price) / originPrice) * 100;

    return `${discountPercentage.toFixed(0)}%`;
  };

  console.log(course?.video, 'course.video');

  return (
    <div className="rounded transition-all cursor-pointer duration-300">
      <div className="relative flex justify-center items-center">
        <Button
          isIconOnly
          onPress={() => {
            if (course?.liked) {
              handleUnLike && handleUnLike(course?.id);
            } else {
              handleLike && handleLike(course?.id);
            }
          }}
          variant="light"
          className="hover:!bg-white-25 rounded-full absolute top-2 right-4 z-[100]"
        >
          {course?.liked ? <IconLikedCourse /> : <IconLikeCourse />}
        </Button>
        <Image
          src={course?.image || '/images/img-default.png'}
          width={302}
          height={200}
          alt=""
          className="w-full h-[200px] rounded rounded-b-none opacity-80"
          onError={(e: any) => {
            e.target.srcset = '/images/img-default.png';
          }}
        />
        {course?.video && (
          <>
            <Image
              src={'/images/img-youtube.png'}
              width={64}
              height={64}
              alt=""
              className="absolute cursor-pointer"
              onClick={() => refModalViewVideo.current.onOpen(course)}
            />
            {/* <Modal
              isOpen={isVideoModalOpen}
              onOpenChange={setIsVideoModalOpen}
              size="4xl"
              hideCloseButton
              backdrop="blur"
            >
              <ModalContent>
                <ModalBody className="p-0">
                  <ReactPlayer
                    url={course.video}
                    width="100%"
                    height="500px"
                    controls
                    playing={isVideoModalOpen}
                    pip
                    config={{
                      file: {
                        attributes: {
                          crossOrigin: 'anonymous',
                          controlsList: 'nodownload',
                        },
                      },
                    }}
                  />
                </ModalBody>
              </ModalContent>
            </Modal> */}
          </>
        )}
      </div>

      <div className="p-4 rounded bg-white-10 flex flex-col gap-[10px]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Text type="font-20-400" className="text-orange">
                {course?.originPrice
                  ? `$ ${formatNumber(course?.originPrice)}`
                  : t('Free')}
              </Text>
              {course?.price && (
                <Text type="font-14-400" className="text-black-6 line-through">
                  $ {formatNumber(course?.price)}
                </Text>
              )}
              {/* <div className="py-[2px] px-2 flex justify-center items-center border-1 border-orange/50 bg-orange/10 rounded-full">
                <Text type="font-16-600" className="text-orange">
                  {course?.price ? `$${course?.price}` : 'Free'}
                </Text>
              </div>
              {course?.price && (
                <Text type="font-14-400" className="text-black-6 line-through">
                  ${course?.price * 1.5}
                </Text>
              )} */}
            </div>
            {course?.originPrice && course?.price && (
              <div className="rounded-full border-1 border-[#F26F2133] py-1 px-3 bg-[#F26F2133] flex items-center gap-1">
                <Text type="font-14-500" className="text-[#F26F21]">
                  {discountCalculator(course?.originPrice, course?.price)}
                </Text>
                <Text type="font-14-500" className="text-[#F26F21]">
                  {t('OFF')}
                </Text>
              </div>
            )}

            {/* {!course?.isOwner && (
              <Button
                variant="light"
                radius="full"
                onClick={() => {
                  if (course?.isOwner) return;
                  run(course.id);
                }}
              >
                <div className="flex items-center gap-1">
                  <Text type="font-14-500" className="text-white">
                    Enroll Course
                  </Text>
                  <Image
                    src={'/icons/ic-arrow-right-up-line.svg'}
                    width={20}
                    height={20}
                    alt=""
                  />
                </div>
              </Button>
            )} */}
          </div>
          {profile?.id !== course?.author?.id && (
            <CustomButtonEnroll
              course={course}
              handleClickButton={() => {
                if (course?.isOwner || course?.authorId === profile?.id) {
                  navigate(ROUTE_PATH.DETAIL_LESSON(course?.id));
                } else {
                  run(course.id);
                }
              }}
              loading={loading}
              token={token}
              label={t('Enroll Now')}
            />
          )}

          <div className="flex flex-col gap-2">
            <Text className="text-white" type="font-18-600">
              {t('This course includes')}
            </Text>
            <div className="flex flex-col gap-1">
              {DATA_NOTE?.map((item) => {
                return (
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-black-6 rounded-full" />
                    <Text className="text-black-6" type="font-16-400">
                      {t(item)}
                    </Text>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ModalViewVideo ref={refModalViewVideo} />
    </div>
  );
};
export default CardEnrollNow;

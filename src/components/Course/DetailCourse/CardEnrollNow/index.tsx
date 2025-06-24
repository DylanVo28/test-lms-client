import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import CustomButtonEnroll from '@/components/UI/CustomButtonEnroll';
import IconLikeCourse from '@/components/UI/IconLikeCourse';
import IconLikedCourse from '@/components/UI/Icons/IconLikedCourse';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import {
  useUSDCOperations,
  VAULT_ADDRESS,
  ZERO_ADDRESS,
} from '@/hooks/useExecute';
import useNavigate from '@/hooks/useNavigate';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useProfile } from '@/store/profile/useProfile';
import { formatNumber } from '@/utils/common';
import { ROUTE_PATH } from '@/utils/const';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import ModalViewVideo from './ModalViewVideo';
import { useEnrollCourse, useEnrollCourseFree } from './service';
import { useAccountInfo } from '@/hooks/useAccountInfo';

const CardEnrollNow = ({
  course,
  handleLike,
  handleUnLike,
  getDetailCourse,
  isLoading: _isLoading,
}: {
  course: any;
  handleLike?: (id: string) => void;
  handleUnLike?: (id: string) => void;
  getDetailCourse?: (id: string, userId?: string | undefined) => void;
  isLoading: boolean;
}) => {
  const { t } = useTranslation('common');

  const isLoading = _isLoading && !course?.id;

  const DATA_NOTE = [
    t('12 hours of on-demand video'),
    t('Exercises'),
    t('1 downloadable resource'),
    t('Mobile and TV access'),
    t('Timed access'),
    t('Certificate of completion'),
  ];

  const accessToken = useAccessToken();
  const { profile } = useProfile();
  const { navigate } = useNavigate();

  const { approveUSDC, buyCourse, loading: loadingBuy } = useUSDCOperations();

  const refModalViewVideo: any = useRef(null);
  const amount = +(course?.price ?? 10000000);

  const preCheckEnroll = async (id: string) => {
    const res = await privateRequest(
      request.post,
      API_PATH.PRE_CHECK_ENROLL(id)
    );
    return res.data;
  };

  const { run, loading, cancel } = useEnrollCourse({
    // pollingInterval: 3000,
    onSuccess: (res) => {
      if (res?.message === 'Successfully') {
        getDetailCourse && getDetailCourse(course?.id);
        toast.success(
          'You have successfully enrolled in the course. Please wait a moment while the system verifies the transaction.'
        );
      }
    },
    onError: (err) => {
      if (err?.message === 'Transaction failed') {
        toast.error(err?.message);
        cancel();
      }
    },
  });

  const { run: runEnrollCourseFree, loading: loadingEnrollCourseFree } =
    useEnrollCourseFree({
      onSuccess: (res) => {
        toast.success(res?.message);
      },
      onError: (err) => {
        toast.error(err?.message);
      },
    });

  const discountCalculator = (originPrice: any, price: any) => {
    const discountPercentage = ((originPrice - price) / originPrice) * 100;

    return `${discountPercentage.toFixed(0)}%`;
  };

  const handleEnroll = async () => {
    try {
      const res = await preCheckEnroll(course.id);
      if (res === true) {
        const kolAddress = course.author.walletAddress || ZERO_ADDRESS;
        const commissionRate = kolAddress !== ZERO_ADDRESS ? '50' : '0';
        await approveUSDC(VAULT_ADDRESS, amount);
        const txHash = await buyCourse(
          course.id,
          amount,
          kolAddress,
          commissionRate
        );
        if (txHash) {
          run(course.id, txHash);
        }
      } else {
        toast.error(
          res?.message || t('You are not eligible to enroll in this course.')
        );
      }
    } catch (error: any) {
      const message = error?.message?.includes('User rejected transaction')
        ? 'user rejected transaction'
        : t('Failed to enroll in the course. Please try again.');

      toast.error(message);
    }
  };

  const { volumeData } = useAccountInfo();

  const handleEnrollCourseFree = () => {
    if (!course?.id || loadingEnrollCourseFree) return;
    runEnrollCourseFree(course?.id);
  };

  return (
    <div className="rounded transition-all cursor-pointer duration-300">
      <div className="relative flex justify-center items-center">
        <Button
          isIconOnly
          isDisabled={!accessToken}
          onPress={() => {
            if (course?.liked) {
              handleUnLike && handleUnLike(course?.id);
            } else {
              handleLike && handleLike(course?.id);
            }
          }}
          variant="light"
          className="hover:!bg-white-25 rounded-full absolute top-2 right-4 z-[10]"
        >
          {course?.liked ? <IconLikedCourse /> : <IconLikeCourse />}
        </Button>
        {isLoading ? (
          <div className="h-[200px] w-full bg-white-10 animate-pulse rounded" />
        ) : (
          <Image
            src={course?.image || '/images/img-default.png'}
            width={302}
            height={200}
            alt=""
            className="w-full h-[200px] rounded rounded-b-none opacity-80 object-cover"
            onError={(e: any) => {
              e.target.srcset = '/images/img-default.png';
            }}
          />
        )}
        {course?.video && (
          <>
            <Image
              src={'/images/img-youtube.png'}
              width={64}
              height={64}
              alt=""
              className="absolute cursor-pointer object-contain"
              onClick={() => refModalViewVideo.current.onOpen(course)}
            />
          </>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div>
          <div className="p-4 rounded bg-white-10 flex flex-col gap-[10px]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-20 bg-white-10 animate-pulse rounded" />
                  <div className="h-4 w-16 bg-white-10 animate-pulse rounded" />
                </div>
                <div className="h-8 w-24 bg-white-10 animate-pulse rounded-full" />
              </div>
              <div className="h-10 w-full bg-white-10 animate-pulse rounded" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-5 w-40 bg-white-10 animate-pulse rounded" />
              <div className="flex flex-col gap-1">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-white-10 animate-pulse rounded" />
                    <div className="h-4 w-48 bg-white-10 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-10 w-full bg-white-10 animate-pulse rounded" />
          </div>
          <div className="p-4 rounded bg-white-10 flex flex-col gap-[10px]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-20 bg-white-10 animate-pulse rounded" />
                  <div className="h-4 w-16 bg-white-10 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isLoading && (
        <div className="p-4 rounded bg-white-10 flex flex-col gap-[10px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Text type="font-20-400" className="text-orange">
                  {course?.price
                    ? `$ ${formatNumber(course?.price)}`
                    : t('Free')}
                </Text>
                {course?.originPrice && (
                  <Text
                    type="font-14-400"
                    className="text-black-6 line-through"
                  >
                    $ {formatNumber(course?.originPrice)}
                  </Text>
                )}
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
            </div>
            {profile?.id !== course?.author?.id && (
              <CustomButtonEnroll
                course={course}
                handleClickButton={async () => {
                  if (!course?.id) return;
                  if (course.isOwner || course.authorId === profile?.id) {
                    navigate(ROUTE_PATH.DETAIL_LESSON(course?.id));
                    return;
                  }

                  if (course?.enroll === 'verified') {
                    navigate(ROUTE_PATH.DETAIL_LESSON(course?.id));
                    return;
                  } else {
                    handleEnroll();
                  }
                }}
                handleEnrollCourseFree={() => {
                  if (!course?.id) return;
                  handleEnrollCourseFree();
                }}
                loading={loadingBuy || loadingEnrollCourseFree || loading}
                token={accessToken}
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

              {course?.unlockIfUserTradesAtLeast > 0 && (
                <div className="flex items-start gap-2 bg-[#F26F2133] p-3 rounded-lg">
                  <IconGift />
                  <div>
                    <Text type="font-16-600" className="text-main">
                      {t('Free Course Unlock Available!')}
                    </Text>
                    <Text type="font-14-400" className="text-black-6">
                      {t('Reach')}{' '}
                      <span className="text-main font-bold">
                        ${course?.unlockIfUserTradesAtLeast}
                      </span>{' '}
                      {t(
                        'in lifetime trading volume to unlock this course for free'
                      )}
                    </Text>
                    <Text type="font-14-400" className="text-black-6">
                      {t('Your current trading volume')}: $
                      {volumeData?.data?.perp_volume_ltd || 0}
                    </Text>
                  </div>
                </div>
              )}

              {course?.unlockIfUserTradesAtLeast == 0 && (
                <div className="flex items-start gap-2 bg-[#F26F2133] p-3 rounded-lg">
                  <IconGift />
                  <div>
                    <Text type="font-16-600" className="text-main">
                      {t('Free Course Unlock Available!')}
                    </Text>
                    <Text type="font-14-400" className="text-black-6">
                      {t('This course is free to enroll')}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ModalViewVideo ref={refModalViewVideo} />
    </div>
  );
};
export default CardEnrollNow;

const IconGift = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 12V22H4V12"
        stroke="#F26F21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 7H2V12H22V7Z"
        stroke="#F26F21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V7"
        stroke="#F26F21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z"
        stroke="#F26F21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z"
        stroke="#F26F21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

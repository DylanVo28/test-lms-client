import { coursePaymentVaultAbi } from '@/abis/coursePaymentVault';
import { usdcAbi } from '@/abis/usdc';
import CustomButtonEnroll from '@/components/UI/CustomButtonEnroll';
import IconLikeCourse from '@/components/UI/IconLikeCourse';
import IconLikedCourse from '@/components/UI/Icons/IconLikedCourse';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import useNavigate from '@/hooks/useNavigate';
import { getAccessToken } from '@/store/auth';
import { useProfile } from '@/store/profile/useProfile';
import { formatNumber } from '@/utils/common';
import { ROUTE_PATH } from '@/utils/const';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRef } from 'react';
import { parseGwei, parseUnits } from 'viem';
import { usePublicClient, useWriteContract } from 'wagmi';
import ModalViewVideo from './ModalViewVideo';
import { useEnrollCourse } from './service';
import { useUSDCOperations } from '@/hooks/useExecute';

const CardEnrollNow = ({
  course,
  handleLike,
  handleUnLike,
  getDetailCourse,
}: {
  course: any;
  handleLike?: (id: string) => void;
  handleUnLike?: (id: string) => void;
  getDetailCourse?: (id: string, userId?: string | undefined) => void;
}) => {
  const accessToken = getAccessToken();
  const { t } = useTranslation('common');

  const DATA_NOTE = [
    t('12 hours of on-demand video'),
    t('Exercises'),
    t('1 downloadable resource'),
    t('Mobile and TV access'),
    t('Timed access'),
    t('Certificate of completion'),
  ];

  const USDC_ADDRESS = '0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F';
  const VAULT_ADDRESS = '0xe9D7daB56CFc0913C93941caFe3d119C7fC3DB35';
  const token = getAccessToken();
  const { profile } = useProfile();
  const { navigate } = useNavigate();
  const { writeContractAsync } = useWriteContract();

  const { approveUSDC, buyCourse, loading: loadingBuy } = useUSDCOperations();

  const refModalViewVideo: any = useRef(null);
  const amount = 0.01;
  const { run, loading, cancel } = useEnrollCourse({
    pollingInterval: 3000,
    onSuccess: (res) => {
      if (res?.message === 'Successfully') {
        toast.success('Enrollment initiated successfully.');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
    onError: (err) => {
      if (err?.message === 'Transaction failed') {
        toast.error(err?.message);
        cancel();
      }
    },
  });
  const discountCalculator = (originPrice: any, price: any) => {
    const discountPercentage = ((originPrice - price) / originPrice) * 100;

    return `${discountPercentage.toFixed(0)}%`;
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
          </>
        )}
      </div>

      <div className="p-4 rounded bg-white-10 flex flex-col gap-[10px]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Text type="font-20-400" className="text-orange">
                {course?.price ? `$ ${formatNumber(course?.price)}` : t('Free')}
              </Text>
              {course?.originPrice && (
                <Text type="font-14-400" className="text-black-6 line-through">
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
                } else {
                  try {
                    console.log('buy');
                    await approveUSDC(VAULT_ADDRESS, amount);
                    const txHash = await buyCourse(course.id, amount);
                    if (txHash) {
                      run(course.id, txHash);
                    }
                  } catch (error) {
                    toast.error(
                      t('Failed to enroll in the course. Please try again.')
                    );
                  }
                }
              }}
              loading={loadingBuy}
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

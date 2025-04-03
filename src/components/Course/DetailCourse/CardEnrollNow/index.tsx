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
import { parseUnits } from 'viem';
import { usePublicClient, useWriteContract } from 'wagmi';
import ModalViewVideo from './ModalViewVideo';
import { useEnrollCourse } from './service';

const CardEnrollNow = ({
  course,
  handleLike,
  handleUnLike,
}: {
  course: any;
  handleLike?: (id: string) => void;
  handleUnLike?: (id: string) => void;
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

  const refModalViewVideo: any = useRef(null);

  const publicClient = usePublicClient();

  const wagmiContractConfig = {
    address: '0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F',
    abi: usdcAbi,
  } as const;

  const { run, loading, cancel } = useEnrollCourse({
    pollingInterval: 3000,
    onSuccess: (res) => {
      console.log(res, 'res123');

      if (res?.data?.courseId) {
        navigate(ROUTE_PATH.DETAIL_LESSON(res?.data?.courseId));
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
                {course?.price ? `$ ${formatNumber(course?.price)}` : t('Free')}
              </Text>
              {course?.originPrice && (
                <Text type="font-14-400" className="text-black-6 line-through">
                  $ {formatNumber(course?.originPrice)}
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
              handleClickButton={async () => {
                if (!course?.id) return;
                if (course.isOwner || course.authorId === profile?.id) {
                  navigate(ROUTE_PATH.DETAIL_LESSON(course?.id));
                } else {
                  console.log('debugg:::', course);
                  try {
                    // await writeContractAsync({
                    //   abi: usdcAbi,
                    //   address: USDC_ADDRESS,
                    //   functionName: 'approve',
                    //   args: [VAULT_ADDRESS, parseUnits('0.01', 18)],
                    // });

                    const amount = parseUnits('0.01', 18);

                    const estimatedGas =
                      await publicClient?.estimateContractGas({
                        address: VAULT_ADDRESS,
                        abi: coursePaymentVaultAbi,
                        functionName: 'pay',
                        args: [course.id, amount],
                        account: profile.walletAddress as `0x${string}`,
                      });

                    if (estimatedGas) {
                      const gasLimit = estimatedGas * BigInt(2);

                      const txHash = await writeContractAsync({
                        abi: coursePaymentVaultAbi,
                        address: VAULT_ADDRESS,
                        functionName: 'pay',
                        args: [course.id, amount],
                        gas: gasLimit,
                      });

                      console.log({ txHash });
                    }
                    // // run(course.id, txHash);
                  } catch (error) {
                    console.error('Contract interaction failed:', error);
                    toast.error(
                      t('Failed to enroll in the course. Please try again.')
                    );
                  }
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

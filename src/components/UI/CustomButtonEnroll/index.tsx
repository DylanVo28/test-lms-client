import { Button, cn } from '@nextui-org/react';
import Text from '../Text';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { useMemo, useState } from 'react';
import { useAccountInfo } from '@/hooks/useAccountInfo';
import { toast } from '../Toast/toast';
import { useTranslation } from 'next-i18next';
import { usePrivy } from '@privy-io/react-auth';

const CustomButtonEnroll = ({
  course,
  loading,
  token,
  handleClickButton,
  handleEnrollCourseFree,
}: {
  course: any;
  handleClickButton: VoidFunction;
  loading: boolean;
  token: any;
  handleEnrollCourseFree: () => Promise<void>;
}) => {
  const [isLoadingEnrollCourseFree, setIsLoadingEnrollCourseFree] =
    useState(false);
  const { balance, symbol, decimals } = useTokenInfo();
  const amount = +(course?.price ?? 10000000);

  const isInsufficientBalance = +balance < +amount;

  const { volumeData } = useAccountInfo();

  const isEnableEnrollCourseFree = useMemo(() => {
    if (course?.unlockIfUserTradesAtLeast == 0) return true;

    if (!volumeData) return false;

    return (
      +volumeData?.data?.perp_volume_ltd >= +course?.unlockIfUserTradesAtLeast
    );
  }, [course?.unlockIfUserTradesAtLeast, volumeData]);

  const { t } = useTranslation('common');
  const authorRole = course?.author?.role;
  const { ready, authenticated, login } = usePrivy();
  // Check both Privy authentication and access token
  const connected = (ready && authenticated) || !!token;

  return (
    <div
      className="w-full"
      style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!connected ? (
        <Button
          onPress={()=>login()}
          className="bg-main w-full min-h-[40px] rounded"
          disabled={isInsufficientBalance}
        >
          <Text className="text-letter" type="font-16-600">
            Connect Wallet
          </Text>
        </Button>
      ) : (
        <>
          {isEnableEnrollCourseFree && (
            <Button
              isLoading={loading}
              onPress={async () => {
                if (course?.enroll === 'verified') {
                  handleClickButton();
                  return;
                }

                if (isLoadingEnrollCourseFree) {
                  toast.info('Please wait a moment');
                  return;
                }
                setIsLoadingEnrollCourseFree(true);
                await handleEnrollCourseFree();
                setTimeout(() => {
                  setIsLoadingEnrollCourseFree(false);
                }, 5000);
              }}
              className="bg-main w-full min-h-[40px] rounded"
              disabled={isInsufficientBalance}
            >
              {course?.enroll === 'verified' ? (
                <Text className="text-text-letter" type="font-16-600">
                  {t('course.goToCourse')}
                </Text>
              ) : (
                <Text className="text-text-letter" type="font-16-600">
                  {t('course.enrollNowForFree')}
                </Text>
              )}
            </Button>
          )}

          {!isEnableEnrollCourseFree && (
            <Button
              isLoading={loading}
              onPress={() => {
                if (course?.enroll === 'pending' || isInsufficientBalance) {
                  return;
                }
                handleClickButton();
              }}
              className={cn(
                'bg-main w-full min-h-[40px] rounded',
                isInsufficientBalance && 'opacity-60 cursor-not-allowed'
              )}
              disabled={isInsufficientBalance}
              data-hover={!isInsufficientBalance}
            >
              {isInsufficientBalance && (
                <Text className="text-text-letter" type="font-16-600">
                  {t('course.insufficientBalance')}
                </Text>
              )}
              {!isInsufficientBalance && (
                <Text className="text-text-letter" type="font-16-600">
                  {course?.enroll === 'verified'
                    ? t('course.goToCourse')
                    : course?.enroll === 'pending'
                    ? t('course.verifying')
                    : t('course.enrollNow')}
                </Text>
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default CustomButtonEnroll;

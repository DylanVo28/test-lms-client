import { Button, cn } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Text from '../Text';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { useMemo, useState } from 'react';
import { useAccountInfo } from '@/hooks/useAccountInfo';
import { toast } from '../Toast/toast';

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

  const authorRole = course?.author?.role;

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

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
                onPress={openConnectModal}
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
                        Go to course
                      </Text>
                    ) : (
                      <Text className="text-text-letter" type="font-16-600">
                        Enroll Now for Free
                      </Text>
                    )}
                  </Button>
                )}

                {!isEnableEnrollCourseFree && (
                  <Button
                    isLoading={loading}
                    onPress={() => {
                      if (
                        course?.enroll === 'pending' ||
                        isInsufficientBalance
                      ) {
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
                        Insufficient balance
                      </Text>
                    )}
                    {!isInsufficientBalance && (
                      <Text className="text-text-letter" type="font-16-600">
                        {course?.enroll === 'verified'
                          ? 'Go to course'
                          : course?.enroll === 'pending'
                          ? 'Verifying...'
                          : 'Enroll Now'}
                      </Text>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomButtonEnroll;

import { Button } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Text from '../Text';
import { useTranslation } from 'next-i18next';
import { useTokenInfo } from '@/hooks/useTokenInfo';

const CustomButtonEnroll = ({
  course,
  loading,
  token,
  handleClickButton,
}: {
  course: any;
  handleClickButton: VoidFunction;
  loading: boolean;
  token: any;
}) => {
  const { t } = useTranslation('common');
  const { balance, symbol, decimals } = useTokenInfo();
  const amount = +(course?.price ?? 10000000);

  const isInsufficientBalance = +balance < +amount;

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
                <Text className="text-white" type="font-16-600">
                  {t('Connect Wallet')}
                </Text>
              </Button>
            ) : (
              <Button
                isLoading={loading}
                onPress={() => {
                  if (course?.enroll === 'pending' || isInsufficientBalance) {
                    return;
                  }
                  handleClickButton();
                }}
                className="bg-main w-full min-h-[40px] rounded"
                disabled={isInsufficientBalance}
              >
                {isInsufficientBalance && (
                  <Text className="text-text-white" type="font-16-600">
                    {t('Insufficient balance')}
                  </Text>
                )}
                {!isInsufficientBalance && (
                  <Text className="text-text-white" type="font-16-600">
                    {course?.enroll === 'verified'
                      ? t('Go to course')
                      : course?.enroll === 'pending'
                      ? t('Verifying...')
                      : t('Enroll Now')}
                  </Text>
                )}
              </Button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomButtonEnroll;

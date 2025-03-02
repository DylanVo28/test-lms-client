import { Button } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Text from '../Text';
import { useTranslation } from 'next-i18next';

const CustomButtonNewCourse = ({
  handleClickButton,
}: {
  handleClickButton: VoidFunction;
}) => {
  const { t } = useTranslation('common');

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div>
            {!connected ? (
              <Button
                onPress={openConnectModal}
                className="bg-main w-max min-h-[40px] rounded"
              >
                <Text className="text-white" type="font-16-600">
                  {t('New Course')}
                </Text>
              </Button>
            ) : (
              <Button
                onPress={handleClickButton}
                className="bg-main w-max min-h-[40px] rounded"
              >
                <Text className="text-text-white" type="font-16-600">
                  {t('New Course')}
                </Text>
              </Button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomButtonNewCourse;

import { Button } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Text from '../Text';
import { useProfile } from '@/store/profile/useProfile';

const CustomButtonComment = ({}: {}) => {
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
            }}
          >
            {!connected ? (
              <Button
                onPress={openConnectModal}
                className="border-1 min-h-10 max-w-[185px] border-black-9 py-2 px-4 rounded bg-black-10"
              >
                <Text className="capitalize text-letter" type="font-16-500">
                  Login to comment
                </Text>
              </Button>
            ) : (
              <Button
                onPress={openConnectModal}
                className="border-1 min-h-10 max-w-[185px] border-black-9 py-2 px-4 rounded bg-black-10"
              >
                <Text className="capitalize text-letter" type="font-16-500">
                  Login to comment
                </Text>
              </Button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomButtonComment;

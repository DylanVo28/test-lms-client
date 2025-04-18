import ContentProfile from '@/layout/MainLayout/MainHeader/ContentProfile';
import { notificationAtom } from '@/store/notification/notification';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import IconUser from '../Icons/IconUser';
import Text from '../Text';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { getCookie } from 'cookies-next';
import { useProfile } from '@/store/profile/useProfile';

const ButtonLoginWallet = ({ setVisible }: any) => {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const accessToken = useAccessToken();
  const { t } = useTranslation('common');
  const { profile } = useProfile();

  console.log('profile:::', profile);

  const [isOpen, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
    if (setVisible) {
      setVisible(false);
    }
  };

  const onOpen = () => {
    setOpen(true);
  };

  return (
    <ConnectButton.Custom>
      {({ openConnectModal, mounted }) => {
        return (
          <div>
            {!profile.id ? (
              <Button
                onPress={() => {
                  disconnect();
                  // sleep 0.5 seconds
                  setTimeout(() => {
                    openConnectModal();
                  }, 500);
                }}
                className="bg-main w-full min-h-[40px] rounded"
              >
                <Text className="text-white" type="font-16-600">
                  {t('Connect Wallet')}
                </Text>
              </Button>
            ) : (
              <Popover
                isOpen={isOpen}
                onClose={onClose}
                classNames={{
                  content:
                    'rounded border-1 p-0 !bg-gray border-[#F0F0F01A] shadow-dropdown',
                }}
                color="default"
                placement="bottom-end"
                onOpenChange={onOpen}
              >
                <PopoverTrigger>
                  <Button
                    isIconOnly
                    className="bg-gray-10 border-1 border-gray-10 rounded-[4px] w-10 h-10"
                  >
                    <IconUser />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <ContentProfile
                    onClosePopover={onClose}
                    disconnect={disconnect}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ButtonLoginWallet;

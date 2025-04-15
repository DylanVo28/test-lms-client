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
import { useRef, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import IconUser from '../Icons/IconUser';
import Text from '../Text';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { getCookie } from 'cookies-next';

const ButtonLoginWallet = ({ setVisible }: any) => {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const accessToken = useAccessToken();
  const { t } = useTranslation('common');
  // const router = useRouter();
  const initialCheckDone = useRef(false);
  // const connectedOnce = useRef(false);

  console.log('adress:::::xxxxx', address, accessToken);

  const [isOpen, setOpen] = useState(false);
  // const [isProcessing, setIsProcessing] = useState(false);
  // const { requestGetProfile } = useProfileInitial();
  // const token = useAccessToken();
  const [setNotifications] = useAtom(notificationAtom);

  // const { run: runLoginWeb3 } = useLoginWeb3({
  //   onSuccess(res) {
  //     toast.success(t('Login successfully'));
  //     setAuthCookies({
  //       token: res?.data?.accessToken,
  //     });
  //     setIsProcessing(false);
  //   },
  //   onError(err) {
  //     toast.error(err?.message);
  //     disconnect();
  //     setIsProcessing(false);
  //   },
  // });

  // useEffect(() => {
  //   if (token) {
  //     requestGetProfile();
  //   }
  // }, [token]);

  // const handleSignMessage = async (messageNonce: string) => {
  //   if (!isConnected || !address || accessToken || isProcessing) {
  //     return;
  //   }

  //   try {
  //     setIsProcessing(true);
  //     const sig = await signMessageAsync({ message: messageNonce });
  //     const body = {
  //       address: address as string,
  //       signature: sig,
  //       themeCode: router.query.code as any,
  //     };

  //     if (router.query.code === 'platform') {
  //       delete body?.themeCode;
  //     }
  //     runLoginWeb3(body);
  //   } catch (err: any) {
  //     toast.error(t('Wallet connection cancelled'));
  //     disconnect();
  //     setIsProcessing(false);
  //   }
  // };

  // const { run: runGetUserNonce } = useGetUserNonce({
  //   onSuccess(res) {
  //     handleSignMessage(res?.data);
  //   },
  // });

  // Track initial connection
  // useEffect(() => {
  //   if (isConnected && isMobile) {
  //     connectedOnce.current = true;
  //   }
  // }, [isConnected]);

  // // Handle mobile wallet return and initial connection
  // useEffect(() => {
  //   if (typeof window === 'undefined' || accessToken || isProcessing) return;

  //   const isMobileReturn = () => {
  //     const hasWalletConnectParams = window.location.href.includes('wc?');
  //     const hasWalletConnectSession = Object.keys(window.localStorage).some(
  //       (key) => key.startsWith('wc@2:client:') || key.includes('wagmi.wallet')
  //     );
  //     return hasWalletConnectParams || hasWalletConnectSession;
  //   };

  //   const shouldTriggerSign =
  //     isConnected &&
  //     address &&
  //     !initialCheckDone.current &&
  //     (isMobileReturn() || connectedOnce.current);

  //   if (shouldTriggerSign && isMobile) {
  //     initialCheckDone.current = true;

  //     // Clean URL if needed
  //     if (window.location.href.includes('wc?')) {
  //       const cleanUrl = window.location.href.split('?')[0];
  //       window.history.replaceState({}, document.title, cleanUrl);
  //     }

  //     // Trigger sign message
  //     runGetUserNonce(address);
  //   }
  // }, [isConnected, address, accessToken, isProcessing]);

  // Reset states on disconnect
  // useEffect(() => {
  //   if (!isConnected && isMobile) {
  //     initialCheckDone.current = false;
  //     setIsProcessing(false);
  //     setNotifications({});
  //   }
  // }, [isConnected]);

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
        const connected = address && accessToken;

        return (
          <div>
            {!connected ? (
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
                onOpenChange={onOpen}
                classNames={{
                  content:
                    'rounded border-1 p-0 !bg-gray border-[#F0F0F01A] shadow-dropdown',
                }}
                color="default"
                placement="bottom-end"
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

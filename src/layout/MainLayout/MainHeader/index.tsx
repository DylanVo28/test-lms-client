import InputText from '@/components/UI/InputText';
import Image from 'next/image';
import Menubar from '../Menubar';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/utils/const';
import { useEffect, useRef, useState } from 'react';
import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { getAccessToken, setAuthCookies } from '@/store/auth';
import { useGetUserNonce, useLoginWeb3 } from './service';
import { toast } from '@/components/UI/Toast/toast';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import { initialProfile } from '@/store/profile/profile';
import ButtonLoginWallet from '@/components/UI/ButtonLoginWallet';
import DrawerMenu from '../Menubar/DrawerMenu';
import ThemeConfiguration from './ThemeConfiguration';
import { useTranslation } from 'next-i18next';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import Notification from '@/components/Notification';
import { useNotifications } from '@/store/notification/useNotification';
import { useMount } from 'ahooks';
import Text from '@/components/UI/Text';
import { notificationAtom } from '@/store/notification/notification';
import { useAtom } from 'jotai';
import clsx from 'clsx';
import { useProfile } from '@/store/profile/useProfile';

const MainHeader = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [valueSearch, setValueSearch] = useState('');
  const { isConnected, address } = useAccount();
  const token = getAccessToken();
  const { signMessageAsync } = useSignMessage();
  const { requestGetProfile, setProfile } = useProfileInitial();
  const refDrawerMenu: any = useRef(null);
  const [urlLogo, setUrlLogo] = useState<string>('');
  const [notifications] = useAtom(notificationAtom);
  const prevIsConnected = useRef<boolean | null>(null);
  const { profile } = useProfile();

  const handleChangeSearch = (e: any) => {
    setValueSearch(e.target.value);
  };

  const { run: runLoginWeb3 } = useLoginWeb3({
    onSuccess(res) {
      toast.success(t('Login successfully'));
      requestGetProfile();
      setAuthCookies({
        token: res?.data?.accessToken,
      });
    },
    onError(err) {
      console.log('errrrrrr', err);
      toast.error(err?.message);
    },
  });
  const { run: runGetUserNonce } = useGetUserNonce({
    onSuccess(res) {
      handleSignMessage(res?.data);
    },
  });

  const handleSignMessage = async (messageNonce: string) => {
    if (!isConnected || !address) {
      return;
    }

    try {
      const sig = await signMessageAsync({ message: messageNonce });
      runLoginWeb3({
        address: address as string,
        signature: sig,
        refCode: (router.query.refCode as string) || '',
      });
    } catch (err: any) {
      console.error('ERROR: ', err);
      toast.error(err?.message);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('logo')) {
        setUrlLogo(localStorage.getItem('logo') as string);
      }
    }
  }, []);

  useEffect(() => {
    if (router.pathname !== ROUTE_PATH.COURSE_SEARCH) {
      setValueSearch('');
    }
  }, [router.pathname]);

  useEffect(() => {
    if (isConnected && address && !token) {
      runGetUserNonce(address);
    }
    if (!isConnected && !token) {
      setAuthCookies({
        token: '',
      });
      setProfile(initialProfile);
    }
  }, [token, isConnected, address]);

  const handleKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      router.push({
        pathname: ROUTE_PATH.COURSE_SEARCH,
        query: { keySearch: valueSearch },
      });
    }
  };

  return (
    <div className="w-full sticky z-[10] top-0 backdrop-blur-sm border-0 md:border-b-1 border-black-10 p-4 md:py-5 md:px-10">
      <div className="max-w-[1440px]  mx-auto flex justify-between items-center">
        <Image
          onClick={() => router.push(ROUTE_PATH.HOME)}
          alt="logo"
          width={125}
          height={46}
          className="cursor-pointer"
          src={urlLogo || '/logo.png'}
        />

        <Image
          onClick={() => refDrawerMenu.current.onOpen()}
          src={'/images/img-menu.png'}
          width={40}
          height={40}
          alt=""
          className="w-10 h-10 block md:hidden"
        />

        <div className="md:flex hidden items-center gap-8">
          <Menubar />

          <div className="flex items-center gap-4">
            <InputText
              onChange={handleChangeSearch}
              onKeyUp={handleKeyUp}
              value={valueSearch}
              startContent={
                <Image
                  width={20}
                  height={20}
                  alt=""
                  src={'/images/img-search.png'}
                />
              }
              className="xl:min-w-[470px] lg:min-w-[320px]"
              radius="sm"
              placeholder={t('Search')}
            />
            <div className="border-1 border-gray-20 h-8" />

            <Popover
              classNames={{
                content:
                  'rounded border-1 p-0 !bg-gray border-[#F0F0F01A] shadow-dropdown',
              }}
              color="default"
              placement="bottom-end"
            >
              <PopoverTrigger>
                <div className="bg-gray-10 flex cursor-pointer justify-center items-center relative border-1 border-gray-10 rounded-[4px] w-10 h-10">
                  {notifications?.totalCount > 0 && (
                    <div
                      className={clsx(
                        'absolute bg-error rounded-full top-[-8px] right-[-8px] h-[18px] w-[18px] flex justify-center items-center',
                        {
                          ['!min-w-8 !right-[-12px] !top-[-12px]']:
                            notifications?.totalCount > 99,
                        }
                      )}
                    >
                      <Text type="font-12-500" className="text-white">
                        {notifications?.totalCount > 99
                          ? '99+'
                          : notifications?.totalCount}
                      </Text>
                    </div>
                  )}

                  <Image
                    src={'/icons/ic-notification.svg'}
                    height={20}
                    width={20}
                    alt=""
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <Notification />
              </PopoverContent>
            </Popover>
            {/* <Button
              isIconOnly
              className="bg-gray-10 border-1 border-gray-10 rounded-[4px] w-10 h-10"
            >
              <Image src={'/icons/ic-user.svg'} height={20} width={20} alt="" />
            </Button> */}

            <ButtonLoginWallet />
            {profile?.role === 'KOL' && (
              <ThemeConfiguration setUrlLogo={setUrlLogo} />
            )}

            {/* <div className="w-full">
              <ConnectButton />
            </div> */}
          </div>
        </div>
      </div>
      <DrawerMenu ref={refDrawerMenu} />
    </div>
  );
};
export default MainHeader;

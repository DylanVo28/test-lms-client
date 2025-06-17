import Notification from '@/components/Notification';
import RegisterFormModal from '@/components/RegisterFormModal';
import ButtonLoginWallet from '@/components/UI/ButtonLoginWallet';
import IconNotification from '@/components/UI/Icons/IconNotification';
import IconSearch from '@/components/UI/Icons/IconSearch';
import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import useNavigate from '@/hooks/useNavigate';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { notificationAtom } from '@/store/notification/notification';
import { useProfile } from '@/store/profile/useProfile';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import { useTheme } from '@/store/theme/useTheme';
import { ROUTE_PATH } from '@/utils/const';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Menubar from '../Menubar';
import DrawerMenu from '../Menubar/DrawerMenu';
import ThemeConfiguration from './ThemeConfiguration';
import useClickOutside from '@/hooks/useClickOutside';

const MainHeader = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [valueSearch, setValueSearch] = useState('');
  const token = useAccessToken();
  const { requestGetProfile } = useProfileInitial();
  const refDrawerMenu: any = useRef(null);
  const { theme } = useTheme();
  const [notifications, setNotifications] = useAtom(notificationAtom);
  const { profile } = useProfile();
  const { navigate } = useNavigate();
  const [isOpen, setOpen] = useState(false);

  const handleChangeSearch = (e: any) => {
    setValueSearch(e.target.value);
  };

  useEffect(() => {
    if (token) {
      requestGetProfile();
    }
  }, [token]);

  useEffect(() => {
    if (router.pathname !== ROUTE_PATH.COURSE_SEARCH) {
      setValueSearch('');
    }
  }, [router.pathname]);

  const handleKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      navigate(ROUTE_PATH.COURSE_SEARCH, { keySearch: valueSearch });

      // router.push({
      //   pathname: ROUTE_PATH.COURSE_SEARCH,
      //   query: { keySearch: valueSearch },
      // });
    }
  };
  const onOpen = () => {
    setOpen(true);
  };

  const refNotification = useRef(null);

  useClickOutside(refNotification, () => setOpen(false));

  return (
    <div className="w-full sticky z-[49] top-0 backdrop-blur-sm border-0 md:border-b-1 border-black-10 p-4 md:py-5 md:px-10">
      <div className="max-w-[1440px]  mx-auto flex justify-between items-center">
        <Image
          onClick={() => navigate(ROUTE_PATH.HOME)}
          alt="logo"
          className="cursor-pointer max-h-[50px] w-auto"
          src={theme?.logo || '/logo.png'}
          width={125}
          height={46}
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
              startContent={<IconSearch />}
              className="xl:min-w-[470px] lg:min-w-[320px]"
              radius="sm"
              placeholder={t('Search')}
            />
            <div className="border-1 border-gray-20 h-8" />

            {/* <Popover
              isOpen={isOpen}
              onClose={() => setOpen(false)}
              onOpenChange={onOpen}
              classNames={{
                content:
                  'rounded border-1 p-0 !bg-gray border-[#F0F0F01A] shadow-dropdown !z-[100]',
                base: '!z-[100]',
              }}
              color="default"
              placement="bottom-end"
            >
              <PopoverTrigger>
                
              </PopoverTrigger>
              <PopoverContent className="rounded-lg">
                <Notification isOpen={isOpen} />
              </PopoverContent>
            </Popover> */}
            {/* <Button
              isIconOnly
              className="bg-gray-10 border-1 border-gray-10 rounded-[4px] w-10 h-10"
            >
              <Image src={'/icons/ic-user.svg'} height={20} width={20} alt="" />
            </Button> */}

            <div
              className="bg-gray-10 flex cursor-pointer justify-center items-center relative border-1 border-gray-10 rounded-[4px] w-10 h-10 z-[100]"
              onClick={() => setOpen(true)}
            >
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

              <IconNotification />

              {isOpen && (
                <div
                  className="absolute top-[40px] right-[-10px] rounded border-1 p-0 !bg-gray border-[#F0F0F01A] shadow-dropdown !z-[100]"
                  ref={refNotification}
                >
                  <Notification isOpen={isOpen} />
                </div>
              )}
            </div>

            <ButtonLoginWallet />
            {profile?.role === 'KOL' && <ThemeConfiguration />}

            {/* <div className="w-full">
              <ConnectButton />
            </div> */}
          </div>
        </div>
      </div>
      <DrawerMenu ref={refDrawerMenu} />
      <RegisterFormModal />
    </div>
  );
};
export default MainHeader;

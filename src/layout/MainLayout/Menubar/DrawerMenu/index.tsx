import { TabMyLearning } from '@/components/MyLearning';
import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import ButtonLoginWallet from '@/components/UI/ButtonLoginWallet';
import ThemeConfiguration from '../../MainHeader/ThemeConfiguration';
import Notification from '@/components/Notification';
import { notificationAtom } from '@/store/notification/notification';
import { useAtom } from 'jotai';
import { useProfile } from '@/store/profile/useProfile';
import useNavigate from '@/hooks/useNavigate';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import IconNotification from '@/components/UI/Icons/IconNotification';

const DrawerMenu = (props: any, ref: any) => {
  const [visible, setVisible] = useState(false);
  const [urlLogo, setUrlLogo] = useState<string>('');
  const [notifications] = useAtom(notificationAtom);
  const { profile } = useProfile();
  const accessToken = useAccessToken();
  const { openConnectModal }: any = useConnectModal();
  const [isOpen, setOpen] = useState(false);

  const router = useRouter();
  const { navigate } = useNavigate();

  const MENUS = useMemo(
    () =>
      profile?.role === 'KOL' || profile?.role === 'ADMIN'
        ? [
            {
              key: 1,
              label: 'My learning',
              href: ROUTE_PATH.MY_LEARNING,
            },
            {
              key: 2,
              label: 'Wish list',
              href: `${ROUTE_PATH.MY_LEARNING}`,
            },
            {
              key: 3,
              label: 'Teach',
              href: ROUTE_PATH.LIST_COURSE,
            },
          ]
        : [
            {
              key: 1,
              label: 'My learning',
              href: ROUTE_PATH.MY_LEARNING,
            },
            {
              key: 2,
              label: 'Wish list',
              href: `${ROUTE_PATH.MY_LEARNING}`,
            },
          ],
    [profile?.role]
  );

  const handleClickRedirectPage = (key: number) => {
    if (!accessToken) {
      openConnectModal();
      return;
    }

    const menuItem = MENUS.find((item) => item.key === key);

    if (key === 2 && menuItem?.href) {
      navigate(menuItem?.href, { type: TabMyLearning.WISHLIST });
    } else {
      menuItem?.href && navigate(menuItem?.href);
    }
    onVisible();
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onVisible = () => {
    setVisible(!visible);
  };
  useImperativeHandle(ref, () => {
    return {
      onOpen: () => {
        setVisible(true);
      },
      onClose: () => setVisible(false),
    };
  });

  return (
    <Drawer
      radius="none"
      hideCloseButton
      size="full"
      classNames={{
        base: 'bgDrawer',
      }}
      isOpen={visible}
      onClose={onVisible}
    >
      <DrawerContent>
        <>
          <DrawerBody className="p-0">
            <div className="flex flex-col">
              <div className="py-4 px-4 flex items-center border-b-1 border-white-10 justify-between">
                <Image
                  alt="logo"
                  width={125}
                  height={46}
                  className="cursor-pointer"
                  src={urlLogo || '/logo.png'}
                />
                <Image
                  onClick={onVisible}
                  src={'/images/ic-close.png'}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                  alt=""
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-6 justify-center items-center py-6 px-4">
                  {MENUS?.map((item) => {
                    return (
                      <Text
                        key={item?.key}
                        onClick={() => handleClickRedirectPage(item?.key)}
                        className={clsx(
                          'cursor-pointer transition-all hover:text-main text-black-5 ',
                          {
                            'text-main font-bold': router.query.type
                              ? router.query.type === TabMyLearning.WISHLIST &&
                                item?.key === 2
                              : item.href === router.pathname,
                          }
                        )}
                        type="font-16-600"
                      >
                        {item?.label}
                      </Text>
                    );
                  })}
                </div>
                <div className="flex justify-center items-center gap-4">
                  <Popover
                    style={{
                      width: '100%',
                      paddingRight: '24px',
                    }}
                    isOpen={isOpen}
                    onClose={() => setOpen(false)}
                    onOpenChange={onOpen}
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
                              'absolute bg-error rounded-full top-[-8px] right-[-8px] h-[18px] w-auto px-1 flex justify-center items-center',
                              {
                                ['!min-w-8 !right-[-12px] !top-[-12px]']:
                                  notifications?.totalCount > 99,
                              }
                            )}
                          >
                            <Text type="font-12-500" className="text-letter">
                              {notifications?.totalCount > 99
                                ? '99+'
                                : notifications?.totalCount}
                            </Text>
                          </div>
                        )}

                        <IconNotification />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="rounded-lg">
                      <Notification isOpen={isOpen} />
                    </PopoverContent>
                  </Popover>
                  <ButtonLoginWallet setVisible={setVisible} />
                  {profile?.role === 'KOL' && <ThemeConfiguration />}
                </div>
              </div>
            </div>
          </DrawerBody>
        </>
      </DrawerContent>
    </Drawer>
  );
};
export default forwardRef(DrawerMenu);

import { TabMyLearning } from '@/components/MyLearning';
import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
import IconNotification from '@/components/UI/Icons/IconNotification';
import Link from 'next/link';
import ProfileModal from '@/components/UI/ProfileModal';
import { formatWalletAddress } from '@/utils/common';
import IconUser from '@/components/UI/Icons/IconUser';
import IconGlobal from '@/components/UI/Icons/IconGlobal';
import { useTranslation } from 'next-i18next';
import { useRouter as useNextRouter } from 'next/router';
import ImageCustom from '@/components/UI/ImageCustom';
import { usePrivy } from '@privy-io/react-auth';

const DrawerMenu = (props: any, ref: any) => {
  const [visible, setVisible] = useState(false);
  const [urlLogo, setUrlLogo] = useState<string>('');
  const [notifications] = useAtom(notificationAtom);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const { profile } = useProfile();
  const accessToken = useAccessToken();
  const { login } = usePrivy();
  const [isOpen, setOpen] = useState(false);

  const router = useRouter();
  const nextRouter = useNextRouter();
  const { navigate } = useNavigate();
  const { t, i18n } = useTranslation('common');

  const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  ];

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsLanguageModalOpen(false);
    // Refresh the page to apply language changes
    window.location.reload();
  };

  const MENUS = useMemo(
    () =>
      profile?.role === 'KOL' || profile?.role === 'ADMIN'
        ? [
            {
              key: 1,
              label: t('header.myLearning'),
              href: ROUTE_PATH.MY_LEARNING,
            },
            {
              key: 2,
              label: t('header.wishList'),
              href: `${ROUTE_PATH.MY_LEARNING}`,
            },
            {
              key: 3,
              label: t('header.teach'),
              href: ROUTE_PATH.LIST_COURSE,
            },
          ]
        : [
            {
              key: 1,
              label: t('header.myLearning'),
              href: ROUTE_PATH.MY_LEARNING,
            },
            {
              key: 2,
              label: t('header.wishList'),
              href: `${ROUTE_PATH.MY_LEARNING}`,
            },
          ],
    [profile?.role]
  );

  const handleClickRedirectPage = (key: number) => {
    if (!accessToken) {
      login();
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
                <ImageCustom
                  alt="logo"
                  width={125}
                  height={46}
                  className="cursor-pointer"
                  src={urlLogo || '/logo.png'}
                />
                <ImageCustom
                  onClick={onVisible}
                  src={'/images/ic-close.png'}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                  alt=""
                />
              </div>
              <div className="flex flex-col gap-4">
                <>
                  {/* Menu Items for Non-Logged In Users */}
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
                                ? router.query.type ===
                                    TabMyLearning.WISHLIST && item?.key === 2
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
                </>
                {accessToken && profile?.id && (
                  <>
                    <div className="flex justify-center items-center gap-4">
                      {/* Action Buttons for Logged In Users */}
                      <div className="flex justify-center items-center gap-4">
                        <Link
                          href={`/${router.query.code}${ROUTE_PATH.NOTIFICATIONS}`}
                        >
                          <div className="bg-gray-10 flex cursor-pointer justify-center items-center relative border-1 border-gray-10 rounded-[4px] w-10 h-10 hover:bg-gray-20 transition-colors">
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
                                <Text
                                  type="font-12-500"
                                  className="text-letter"
                                >
                                  {notifications?.totalCount > 99
                                    ? '99+'
                                    : notifications?.totalCount}
                                </Text>
                              </div>
                            )}
                            <IconNotification />
                          </div>
                        </Link>

                        {/* Language Switcher Button */}
                        {/* <Button
                          isIconOnly
                          variant="light"
                          className="bg-gray-10 border-1 border-gray-10 rounded-[4px] w-10 h-10 hover:bg-gray-20 transition-colors"
                          onPress={() => setIsLanguageModalOpen(true)}
                        >
                          <IconGlobal />
                        </Button> */}

                        {profile?.role === 'KOL' && <ThemeConfiguration />}
                      </div>

                      {/* Login Button for Non-Logged In Users */}
                      <div className="flex justify-center items-center gap-4">
                        {!profile.id ? (
                          <Button
                            onPress={() => {
                              login();
                            }}
                            className="bg-main w-full min-h-[40px] rounded"
                          >
                            <Text className="text-letter" type="font-16-600">
                              Connect Wallet
                            </Text>
                          </Button>
                        ) : (
                          <Button
                            isIconOnly
                            className="bg-gray-10 border-1 border-gray-10 rounded-[4px] w-10 h-10"
                            onClick={onOpen}
                          >
                            <IconUser />
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </DrawerBody>
        </>
      </DrawerContent>

      <ProfileModal isOpen={isOpen} onClose={() => setOpen(false)} />

      {/* Language Selection Modal */}
      <Modal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        size="sm"
        placement="center"
        classNames={{
          base: 'bg-card border border-white-10',
          header: 'border-b border-white-10',
          body: 'py-6',
          footer: 'border-t border-white-10',
          backdrop: 'bg-black/50 backdrop-blur-sm',
          wrapper: 'items-center justify-center',
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: 'easeOut',
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: 'easeIn',
              },
            },
          },
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <Text type="font-18-600" className="text-letter">
              {t('header.selectLanguage')}
            </Text>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              {LANGUAGES.map((language) => (
                <Button
                  key={language.code}
                  variant="light"
                  className={clsx(
                    'w-full justify-start h-12 px-4 transition-all',
                    {
                      'bg-main text-letter':
                        language.code === currentLanguage.code,
                      'bg-white-10 hover:bg-white-20 text-letter':
                        language.code !== currentLanguage.code,
                    }
                  )}
                  onPress={() => handleLanguageChange(language.code)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-xl">{language.flag}</span>
                    <Text
                      type="font-16-500"
                      className={clsx('flex-1 text-left', {
                        'text-letter': language.code === currentLanguage.code,
                        'text-letter/70':
                          language.code !== currentLanguage.code,
                      })}
                    >
                      {language.name}
                    </Text>
                    {language.code === currentLanguage.code && (
                      <div className="w-2 h-2 bg-letter rounded-full"></div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Drawer>
  );
};
export default forwardRef(DrawerMenu);

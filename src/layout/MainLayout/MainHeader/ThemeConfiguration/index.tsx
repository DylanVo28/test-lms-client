import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import ThemeIcon from './Icons/ThemeIcon';
import CloseIcon from './Icons/CloseIcon';
import ColorTheme from './ColorTheme';
import EditLogo from './EditLogo';
import Languages from './Languages';
import { useCreateTheme, useUpdateTheme } from './service';
import { toast } from '@/components/UI/Toast/toast';
import { useTranslation } from 'next-i18next';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Text from '@/components/UI/Text';
import { initialTheme } from '@/store/theme/theme';
import { useProfileInitial } from '@/store/profile/useProfileInitial';

const ThemeConfiguration = ({
  setUrlLogo,
}: {
  setUrlLogo: (value: string) => void;
}) => {
  const { t } = useTranslation('common');
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [color, setColor] = useState<string>('');
  const [langs, setLangs] = useState<string[]>(['en']);
  const [logo, setLogo] = useState<string>('');
  const [isNonUserSave, setIsNonUserSave] = useState<boolean>(false);
  const { profile } = useProfileInitial();
  const {
    theme: dataThemeConfig,
    requestGetTheme,
    setTheme,
  } = useThemeInitial();
  const { i18n } = useTranslation();
  const { run: createTheme, loading: createThemeLoading } = useCreateTheme({
    onSuccess() {
      toast.success(t('Saved Theme Configuration'));
      requestGetTheme();
      onClose();
    },
    onError() {
      toast.error(t('Failed Theme Configuration'));
    },
  });
  const { run: updateTheme, loading: updateThemeLoading } = useUpdateTheme({
    onSuccess() {
      toast.success(t('Saved Theme Configuration'));
      onClose();
      requestGetTheme();
    },
    onError() {
      toast.error(t('Failed Theme Configuration'));
    },
  });

  const onChangeColor = (color: string) => {
    setColor(color);
  };

  const onChangeLangs = (langs: string[]) => {
    setLangs(langs);
  };

  const onChangeLogo = (logo: string) => {
    setLogo(logo);
  };

  const onSave = () => {
    const body = { color, logo, langs };
    if (dataThemeConfig?.userId) {
      updateTheme(dataThemeConfig.userId, body);
      return;
    }
    createTheme(body);
  };

  useEffect(() => {
    setLogo(dataThemeConfig.logo);
    setUrlLogo(dataThemeConfig.logo);
    if (dataThemeConfig?.langs && dataThemeConfig.langs.length > 0) {
      setLangs(dataThemeConfig.langs);
      i18n.changeLanguage(dataThemeConfig.langs[0]);
    } else {
      i18n.changeLanguage('en');
    }
    if (dataThemeConfig.color) {
      setColor(dataThemeConfig.color);
      document.body.setAttribute('data-theme', dataThemeConfig.color);
    }
  }, [dataThemeConfig]);

  useEffect(() => {
    if (isNonUserSave && profile?.id && dataThemeConfig?.userId) {
      onSave();
      setIsNonUserSave(false);
    }
  }, [isNonUserSave, profile, dataThemeConfig]);

  useEffect(() => {
    if (profile?.id) {
      requestGetTheme();
    } else {
      setTheme(initialTheme);
    }
  }, [profile]);

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        className={`bg-gray-10 border-1 border-gray-10 rounded-[4px] w-10 h-10`}
      >
        <ThemeIcon />
      </Button>

      <Drawer
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        closeButton={<></>}
      >
        <DrawerContent className="p-[24px] flex flex-col gap-[32px] bg-gray-40 backdrop-blur-xl">
          {(onClose) => (
            <>
              <DrawerHeader className="flex justify-between items-center gap-1 p-0">
                <span className="text-[28px] font-bold leading-[150%] text-white">
                  {t('Theme Configuration')}
                </span>
                <CloseIcon onClick={onClose} className={'cursor-pointer'} />
              </DrawerHeader>

              <Divided />
              <div className="flex flex-col gap-[32px] p-0">
                <EditLogo logo={logo} onChangeLogo={onChangeLogo} />
                <ColorTheme dataColor={color} onChangeColor={onChangeColor} />
                <Languages dataLangs={langs} onChangeLangs={onChangeLangs} />
                <div className="flex justify-end">
                  <ConnectButton.Custom>
                    {({ account, chain, openConnectModal, mounted }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;

                      const onPress = () => {
                        if (!connected) {
                          openConnectModal();
                          setIsNonUserSave(true);
                        } else {
                          onSave();
                        }
                      };

                      return (
                        <div>
                          <Button
                            isLoading={createThemeLoading || updateThemeLoading}
                            onPress={onPress}
                            className="min-h-[40px] rounded mt-2 bg-main"
                          >
                            <Text className="text-white" type="font-16-600">
                              Save
                            </Text>
                          </Button>
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

const Divided = () => <div className="w-full border border-gray-60" />;

export default ThemeConfiguration;

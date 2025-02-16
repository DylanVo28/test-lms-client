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
  const { theme: dataThemeConfig, requestGetTheme } = useThemeInitial();
  const { i18n } = useTranslation();

  const { run: createTheme, loading: createThemeLoading } = useCreateTheme({
    onSuccess() {
      toast.success(t('Saved Theme Configuration'));
      requestGetTheme();
      onClose();
    },
    onError() {
      toast.success(t('Failed Theme Configuration'));
    },
  });
  const { run: updateTheme, loading: updateThemeLoading } = useUpdateTheme({
    onSuccess() {
      toast.success(t('Saved Theme Configuration'));
      onClose();
      requestGetTheme();
    },
    onError() {
      toast.success(t('Failed Theme Configuration'));
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
    if (dataThemeConfig) {
      updateTheme(dataThemeConfig.userId, body);
      return;
    }
    createTheme(body);
  };

  useEffect(() => {
    if (dataThemeConfig.logo) {
      setLogo(dataThemeConfig.logo);
      setUrlLogo(dataThemeConfig.logo);
    }
    if (dataThemeConfig.langs && dataThemeConfig.langs.length > 0) {
      setLangs(dataThemeConfig.langs);
      i18n.changeLanguage(dataThemeConfig.langs[0]);
    } else {
      i18n.changeLanguage('en');
    }
    if (dataThemeConfig.color) {
      setColor(dataThemeConfig.color);
      document.documentElement.style.setProperty(
        '--main-color',
        dataThemeConfig.color
      );
    }
  }, [dataThemeConfig]);

  useEffect(() => {
    requestGetTheme();
  }, []);

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
        <DrawerContent className="p-[24px] flex flex-col gap-[32px] bg-[#24292fe5] backdrop-blur-xl">
          {(onClose) => (
            <>
              <DrawerHeader className="flex justify-between items-center gap-1 p-0">
                <span className="text-[28px] font-bold leading-[150%]">
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
                  <Button
                    isLoading={createThemeLoading || updateThemeLoading}
                    onPress={onSave}
                    type="submit"
                    className="w-fit px-[24px] bg-main text-white font-semibold py-[10px] rounded-[4px] hover:bg-cyan-400 transition"
                  >
                    {t('Save')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

const Divided = () => <div className="w-full border border-[#2B3032]" />;

export default ThemeConfiguration;

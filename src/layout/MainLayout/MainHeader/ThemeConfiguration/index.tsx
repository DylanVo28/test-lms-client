import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  Slider,
  useDisclosure,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import ThemeIcon from './Icons/ThemeIcon';
import CloseIcon from './Icons/CloseIcon';
import CustomColors from './CustomColors';
import EditLogo from './EditLogo';
import Languages from './Languages';
import { useCreateTheme, useUpdateTheme } from './service';
import { toast } from '@/components/UI/Toast/toast';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Text from '@/components/UI/Text';
import {
  ImodeTheme,
  initialTheme,
  CustomColors as CustomColorsType,
} from '@/store/theme/theme';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import { useTheme } from '@/store/theme/useTheme';
import InputText from '@/components/UI/InputText';
import { useSearchParams } from 'next/navigation';
import TagInput, { topicsAtom } from '@/components/UI/TagInput';
import { useAtom } from 'jotai';
import InputTextArena from '@/components/UI/InputTextArena';
import EditBanner from './EditBanner';

const DEFAULT_SELECT_LANG = 'en';
const DEFAULT_COLOR = '#02A6C2';

const ThemeConfiguration = ({}: {}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [color, setColor] = useState<string>('');
  const [langs, setLangs] = useState<string[]>(['en']);
  const [logo, setLogo] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [topics, setTopics] = useAtom(topicsAtom);
  const [banner, setBanner] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [customColors, setCustomColors] = useState<CustomColorsType>({
    primary: '#02A6C2',
    background: '#FFFFFF',
    card: '#F8F9FA',
    secondary: '#6C757D',
  });

  const [valueColorTheme, setValueColorTheme] = useState<any>({});

  const [isNonUserSave, setIsNonUserSave] = useState<boolean>(false);
  const { profile } = useProfileInitial();

  const { requestGetTheme, myTheme: dataThemeConfig } = useThemeInitial();

  const { run: createTheme, loading: createThemeLoading } = useCreateTheme({
    onSuccess() {
      toast.success('Saved White Labeling');
      requestGetTheme();
      onClose();
    },
    onError() {
      toast.error('Failed White Labeling');
    },
  });
  const { run: updateTheme, loading: updateThemeLoading } = useUpdateTheme({
    onSuccess() {
      toast.success('Saved White Labeling');
      onClose();
      requestGetTheme();
    },
    onError() {
      toast.error('Failed White Labeling');
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

  const onChangeCode = (e: any) => {
    setCode(e.target.value);
  };

  const onChangeTitle = (e: any) => {
    setTitle(e.target.value);
  };

  const onChangeDescription = (e: any) => {
    setDescription(e.target.value);
  };

  const onSave = () => {
    const body = {
      color: valueColorTheme?.color,
      customColors,
      code,
      logo,
      langs,
      title,
      banner,
      description,
      topics,
    };
    if (dataThemeConfig?.userId) {
      updateTheme(dataThemeConfig.userId, body);
      return;
    }
    createTheme(body);
  };

  useEffect(() => {
    setLogo(dataThemeConfig.logo);
    setCode(dataThemeConfig.code);
    setTitle(dataThemeConfig?.title);
    setDescription(dataThemeConfig?.description);
    setTopics(dataThemeConfig?.topics);
    setBanner(dataThemeConfig?.banner);
    setValueColorTheme({
      color: dataThemeConfig?.color,
      modeTheme: dataThemeConfig?.modeTheme,
    });

    if (dataThemeConfig?.customColors) {
      setCustomColors(dataThemeConfig.customColors);
    }

    // todo: set langs
    if (dataThemeConfig?.langs && dataThemeConfig.langs.length > 0) {
      setLangs(dataThemeConfig.langs);
    } else {
    }
    if (dataThemeConfig.color) {
      //   console.log(dataThemeConfig, 'dataThemeConfig');

      setColor(dataThemeConfig.color);
      //   document.body.setAttribute('data-theme', dataThemeConfig.color);
    }
  }, [dataThemeConfig]);

  useEffect(() => {
    if (isNonUserSave && profile?.id && dataThemeConfig?.userId) {
      onSave();
      setIsNonUserSave(false);
    }
  }, [isNonUserSave, profile, dataThemeConfig]);

  // useEffect(() => {
  //   if (profile?.id) {
  //     requestGetTheme();
  //   }
  // }, [profile]);

  const onCopy = () => {
    window.navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL}/${code}`
    );
    toast.success('Copied!');
  };

  const onChangeBanner = (urlImg: string) => {
    setBanner(urlImg);
  };

  const handleChangeValueColor = (item: any, modeTheme: ImodeTheme) => {
    setValueColorTheme({
      color: item?.theme,
      modeTheme,
    });
  };

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
                  {'Theme Configuration'}
                </span>
                <CloseIcon onClick={onClose} className={'cursor-pointer'} />
              </DrawerHeader>

              <Divided />
              <div className="flex flex-col gap-[32px] p-0">
                <div className="flex flex-col gap-4">
                  <Text className="text-[18px] font-semibold">{'Domain'}</Text>
                  <InputText
                    inputDefault
                    onChange={onChangeCode}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <Text type="font-16-400" className="w-max text-black-7">
                          {process.env.NEXT_PUBLIC_APP_URL}/
                        </Text>
                      </div>
                    }
                    value={code}
                    className="w-full rounded-[4px] active:outline-hidden"
                    // radius="sm"
                    placeholder={'slug'}
                  />
                  <Button
                    onPress={onCopy}
                    className="rounded-[4px] font-bold text-base text-main bg-[#16343B] h-[44px]"
                  >
                    {'Copy Address'}
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  <Text className="text-[18px] font-semibold">{'Title'}</Text>
                  <InputText
                    inputDefault
                    onChange={onChangeTitle}
                    value={title}
                    className="w-full rounded-[4px] active:outline-hidden"
                    // radius="sm"
                    placeholder={'Web development course'}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Text className="text-[18px] font-semibold">
                    {'Description'}
                  </Text>
                  <InputTextArena
                    inputDefault
                    onChange={onChangeDescription}
                    value={description}
                    minRows={4}
                    className="w-full rounded-[4px] active:outline-hidden"
                    // radius="sm"
                    placeholder={
                      'With one of our online web development courses, you can explore different areas of this in-demand field.'
                    }
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <Text className="text-[18px] font-semibold">{'Topics'}</Text>
                  <TagInput />
                </div>
                <EditBanner value={banner} onChange={onChangeBanner} />
                <EditLogo logo={logo} onChangeLogo={onChangeLogo} />

                <CustomColors
                  colors={customColors}
                  onColorsChange={setCustomColors}
                />

                <Languages dataLangs={langs} onChangeLangs={onChangeLangs} />
                <div className="flex justify-end">
                  <ConnectButton.Custom>
                    {({ account, chain, openConnectModal, mounted }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;

                      const onPress = () => {
                        const cropperImage =
                          localStorage.getItem('cropper-image');
                        if (cropperImage) {
                          toast.error('There are some images not cropped');
                          return;
                        }

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

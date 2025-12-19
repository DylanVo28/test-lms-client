import InputText from '@/components/UI/InputText';
import InputTextArena from '@/components/UI/InputTextArena';
import TagInput, { topicsAtom } from '@/components/UI/TagInput';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import {
  CustomColors as CustomColorsType,
  DefaultThemeColor,
} from '@/store/theme/theme';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import { applyCustomColors } from '@/utils/themeColors';
import {
  saveThemePreview,
  setPreviewMode,
  THEME_PREVIEW_KEY,
  THEME_PREVIEW_MODE_KEY,
} from '@/utils/theme-preview';
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from '@nextui-org/react';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import CustomColors from './CustomColors';
import EditBanner from './EditBanner';
import EditLogo from './EditLogo';
import CloseIcon from './Icons/CloseIcon';
import ThemeIcon from './Icons/ThemeIcon';
import Languages from './Languages';
import { useCreateTheme, useUpdateTheme } from './service';

const ThemeConfiguration = ({}: {}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { authenticated, ready } = usePrivy();
  const { address, isConnected } = useAccount();

  const [langs, setLangs] = useState<string[]>(['en']);
  const [logo, setLogo] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [topics, setTopics] = useAtom(topicsAtom);
  const [banner, setBanner] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [customColors, setCustomColors] =
    useState<CustomColorsType>(DefaultThemeColor);

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

  const onSave = ({
    forceCustomColorsData,
  }: {
    forceCustomColorsData?: CustomColorsType;
  }) => {
    const body = {
      color: JSON.stringify(
        forceCustomColorsData || customColors || DefaultThemeColor
      ),
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

    if (dataThemeConfig?.color) {
      setCustomColors(dataThemeConfig.color);
    }

    // todo: set langs
    if (dataThemeConfig?.langs && dataThemeConfig.langs.length > 0) {
      setLangs(dataThemeConfig.langs);
    } else {
    }
  }, [dataThemeConfig]);

  useEffect(() => {
    if (isNonUserSave && profile?.id && dataThemeConfig?.userId) {
      onSave({});
      setIsNonUserSave(false);
    }
  }, [isNonUserSave, profile, dataThemeConfig]);

  const isPreview = localStorage.getItem(THEME_PREVIEW_MODE_KEY) === 'true';

  const handlePreview = () => {
    const previewData = {
      title,
      description,
      topics,
      banner,
      logo,
      color: customColors,
    };
    saveThemePreview(previewData);
    setPreviewMode(true);
    requestGetTheme(); // T
  };

  const handleExitPreview = () => {
    setPreviewMode(false);
    localStorage.removeItem(THEME_PREVIEW_KEY);
    localStorage.removeItem(THEME_PREVIEW_MODE_KEY);

    // sleep 0.5 seconds

    requestGetTheme(); // F
  };

  useEffect(() => {
    if (isPreview) {
      const previewData = localStorage.getItem(THEME_PREVIEW_KEY);
      if (previewData) {
        const parsedData = JSON.parse(previewData);
        setTitle(parsedData.title);
        setDescription(parsedData.description);
        setTopics(parsedData.topics);
        setBanner(parsedData.banner);
        setLogo(parsedData.logo);
        setCustomColors(parsedData.color);
      }
    }
  }, [isPreview]);

  const onCopy = () => {
    window.navigator.clipboard.writeText(`${window.location.origin}/${code}`);
    toast.success('Copied!');
  };

  const onChangeBanner = (urlImg: string) => {
    setBanner(urlImg);
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
                <span className="text-[28px] font-bold leading-[150%] text-letter">
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
                        <Text
                          type="font-16-400"
                          className="w-max text-letter/70"
                        >
                          {window.location.origin}/
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
                  onColorsChange={(data, syncToServer) => {
                    setCustomColors(data);

                    if (syncToServer) {
                      onSave({
                        forceCustomColorsData: data,
                      });

                      if (isPreview) {
                        //exit preview mode
                        localStorage.removeItem(THEME_PREVIEW_KEY);
                        localStorage.removeItem(THEME_PREVIEW_MODE_KEY);

                        handleExitPreview();
                      }
                    }
                  }}
                  isLoading={createThemeLoading || updateThemeLoading}
                />

                <Languages dataLangs={langs} onChangeLangs={onChangeLangs} />
                <div className="flex justify-end">
                  {(() => {
                    const connected = ready && authenticated && isConnected && address;

                    const onPress = () => {
                      if (!connected) {
                        // Mở modal Privy để kết nối ví
                        if (typeof window !== 'undefined' && window.openModalPrivyConnect) {
                          window.openModalPrivyConnect();
                        }
                        setIsNonUserSave(true);
                      } else {
                        onSave({});
                        if (isPreview) {
                          handleExitPreview();
                        }
                      }
                    };

                    return (
                      <div className="flex gap-2">
                        {isPreview && (
                          <Button
                            className="min-h-[40px] rounded mt-2 border-1 border-main"
                            onClick={handleExitPreview}
                          >
                            <Text className="text-letter" type="font-16-600">
                              Exit Preview
                            </Text>
                          </Button>
                        )}
                        <Button
                          className="min-h-[40px] rounded mt-2 border-1 border-main"
                          onClick={handlePreview}
                        >
                          <Text className="text-letter" type="font-16-600">
                            {isPreview ? 'Update Preview' : 'Preview'}
                          </Text>
                        </Button>
                        <Button
                          isLoading={createThemeLoading || updateThemeLoading}
                          onPress={onPress}
                          className="min-h-[40px] rounded mt-2 bg-main"
                        >
                          <Text className="text-letter" type="font-16-600">
                            Save
                          </Text>
                        </Button>
                      </div>
                    );
                  })()}
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

// import RadioCustom from '@/components/UI/RadioCustom';
import Text from '@/components/UI/Text';
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
  RadioGroup,
  Radio,
  Button,
} from '@nextui-org/react';

import languages from '../ThemeConfiguration/data/languages.json';
import { useMemo, useState, useEffect } from 'react';
import CustomModal from '@/components/UI/CustomModal';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import IconArrowRight from '@/components/UI/Icons/IconArrowRight';
import {
  setupGoogleTranslate,
  translatePage,
  hideGoogleTranslateElements,
  getTranslateStatus,
} from '@/utils/googleTranslate';
import {
  debugTranslation,
  testVietnameseTranslation,
} from '@/utils/debugTranslate';

interface IProps {
  onClosePopover: VoidFunction;
}

export default function LanguageModal({ onClosePopover }: IProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { theme: dataThemeConfig } = useThemeInitial();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isTranslateReady, setIsTranslateReady] = useState<boolean>(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
      console.log('Loaded saved language:', savedLanguage);
    } else if (dataThemeConfig?.langs?.length > 0) {
      setSelectedLanguage(dataThemeConfig.langs[0]);
    } else {
      setSelectedLanguage(languages[0].code);
    }
  }, [dataThemeConfig]);

  useEffect(() => {
    const initializeTranslate = async () => {
      try {
        console.log('Starting Google Translate initialization...');
        await setupGoogleTranslate();

        const checkReady = () => {
          const status = getTranslateStatus();
          console.log('Google Translate status:', status);

          if (status.isReady) {
            setIsTranslateReady(true);
            console.log('Google Translate is ready!');

            const savedLanguage = localStorage.getItem('selectedLanguage');
            if (savedLanguage && savedLanguage !== 'en') {
              console.log('Auto-translating to saved language:', savedLanguage);
              setTimeout(() => {
                translatePage(savedLanguage);
              }, 2000);
            }
          } else {
            console.log('Google Translate not ready yet, checking again...');
            setTimeout(checkReady, 1000);
          }
        };

        setTimeout(checkReady, 1500);
      } catch (error) {
        console.error('Failed to initialize Google Translate:', error);
      }
    };

    initializeTranslate();
  }, []);

  const onChangeRadioGroup = (e: any) => {
    const value = e.target.value;
    console.log('Language selected:', value);

    setSelectedLanguage(value);
    localStorage.setItem('selectedLanguage', value);

    if (value === 'vi') {
      console.log('Vietnamese selected - running debug test');
      debugTranslation();
    }

    if (isTranslateReady) {
      console.log('Triggering translation to:', value);
      setTimeout(() => {
        translatePage(value);
        if (value === 'vi') {
          setTimeout(() => {
            console.log('After Vietnamese translation attempt:');
            debugTranslation();
          }, 2000);
        }
      }, 100);
    } else {
      console.log('Google Translate not ready, waiting...');
      setTimeout(() => {
        if (getTranslateStatus().isReady) {
          translatePage(value);
        }
      }, 2000);
    }

    onClose();
    onClosePopover();
  };

  const findLang = (code: string) => {
    return languages.find((lang) => lang.code === code)?.name || '';
  };
  const showLangs = useMemo<{ code: string; name: string }[]>(() => {
    if (dataThemeConfig?.langs?.length > 0) {
      return dataThemeConfig.langs.map((code) => {
        if (!findLang(code)) {
          return {
            code,
            name: code,
          };
        }
        return {
          code,
          name: findLang(code),
        };
      });
    }
    return [languages[0]];
  }, [dataThemeConfig]);

  return (
    <>
      <div
        onClick={onOpen}
        className="py-3 transition-all flex justify-between items-center cursor-pointer px-4 hover:bg-green-10"
      >
        <Text type="font-14-500" className="text-white">
          {findLang(selectedLanguage)}
        </Text>

        <IconArrowRight />
      </div>
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <ModalHeader className="flex justify-between items-center gap-1">
          {'Select Language'}
        </ModalHeader>
        <ModalBody>
          <RadioGroup
            classNames={{
              wrapper: 'gap-3',
            }}
            onChange={onChangeRadioGroup}
            value={selectedLanguage}
          >
            {showLangs.map((lang) => {
              return (
                <Radio
                  color="secondary"
                  classNames={{
                    wrapper:
                      '!border-1 !border-black-7  group-data-[selected=true]:!border-main',
                  }}
                  key={lang.code}
                  value={lang.code}
                >
                  {lang.name}
                </Radio>
              );
            })}
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            onPress={onClose}
            className="min-h-[40px] bg-main rounded mt-2"
          >
            <Text className="text-white" type="font-16-600">
              {'Close'}
            </Text>
          </Button>
        </ModalFooter>
      </CustomModal>
    </>
  );
}

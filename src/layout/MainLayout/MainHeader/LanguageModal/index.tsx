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
import { useMemo } from 'react';
import CustomModal from '@/components/UI/CustomModal';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import IconArrowRight from '@/components/UI/Icons/IconArrowRight';

interface IProps {
  onClosePopover: VoidFunction;
}

export default function LanguageModal({ onClosePopover }: IProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { theme: dataThemeConfig } = useThemeInitial();

  const onChangeRadioGroup = (e: any) => {
    const value = e.target.value;
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
          Language
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
            value={''}
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

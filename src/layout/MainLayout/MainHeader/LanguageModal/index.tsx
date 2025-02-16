// import RadioCustom from '@/components/UI/RadioCustom';
import Text from '@/components/UI/Text';
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
  RadioGroup,
  Radio,
} from '@nextui-org/react';

import languages from '../ThemeConfiguration/data/languages.json';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import CustomModal from '@/components/UI/CustomModal';
import { useThemeInitial } from '@/store/theme/useThemeInitial';

export default function LanguageModal() {
  const { t, i18n } = useTranslation('common');
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [langSelected, setLangSelected] = useState('');
  const { theme: dataThemeConfig } = useThemeInitial();

  const onChangeRadioGroup = (e: any) => {
    setLangSelected(e.target.value);
  };

  const onSave = () => {
    if (langSelected) {
      i18n.changeLanguage(langSelected);
    }
  };

  const findLang = (code: string) => {
    return languages.find((lang) => lang.code === code)?.name || '';
  };
  const showLangs = useMemo<{ code: string; name: string }[]>(() => {
    if (dataThemeConfig.langs.length > 0) {
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
        className="py-3 transition-all flex justify-between items-center cursor-pointer px-4 hover:bg-green/10"
      >
        <Text type="font-14-500" className="text-white">
          {findLang(i18n.language)}
        </Text>

        <Image
          src={'/images/img-arrow-right.png'}
          width={20}
          height={20}
          alt=""
        />
      </div>
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <ModalHeader className="flex flex-col gap-1">
          {t('Select Language')}
        </ModalHeader>
        <ModalBody>
          <RadioGroup
            color="default"
            onChange={onChangeRadioGroup}
            value={langSelected || i18n.language}
          >
            {showLangs.map((lang) => {
              return (
                <Radio
                  classNames={{
                    wrapper: 'after:!bg-main before:!border-black-7',
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
            className="rounded-md"
            color="danger"
            variant="light"
            onPress={onOpenChange}
          >
            {t('Close')}
          </Button>
          <Button
            className="bg-main rounded-md"
            color="primary"
            onPress={() => {
              onSave();
              onOpenChange();
            }}
          >
            {t('Save')}
          </Button>
        </ModalFooter>
      </CustomModal>
    </>
  );
}

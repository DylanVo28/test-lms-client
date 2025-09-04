import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import IconGlobal from '../Icons/IconGlobal';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh-CN', name: '中文 (简体)', flag: '🇨🇳' },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === router.locale) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: languageCode });
    setIsOpen(false);
  };

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <Button
          variant="light"
          className="min-w-0 p-2 h-10 w-10 bg-gray-10 border-1 border-gray-10 rounded-[4px]"
          isIconOnly
        >
          <IconGlobal />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        className="bg-gray border-1 border-[#F0F0F01A] shadow-dropdown"
        onAction={(key) => handleLanguageChange(key as string)}
      >
        {languages.map((language) => (
          <DropdownItem
            key={language.code}
            className={`text-letter hover:bg-gray-10 ${
              router.locale === language.code ? 'bg-gray-10' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSwitcher;

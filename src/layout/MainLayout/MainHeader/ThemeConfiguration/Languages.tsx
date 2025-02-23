import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Checkbox, CheckboxGroup } from '@nextui-org/react';
import React, { useState } from 'react';
import languages from './data/languages.json';
import { useTranslation } from 'next-i18next';

const Languages = ({
  onChangeLangs,
  dataLangs,
}: {
  onChangeLangs: (value: string[]) => void;
  dataLangs: string[];
}) => {
  const { t } = useTranslation('common');
  const [langues, setLangues] = useState(languages);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredLangs = languages.filter((lang) =>
      lang.name.toLowerCase().includes(value)
    );
    setLangues(filteredLangs);
  };

  const onChange = (values: string[]) => {
    onChangeLangs(values);
  };

  return (
    <div className="p-[20px] bg-gray-50 border border-[#00000033] rounded-[4px]">
      <div className="flex justify-between">
        <Text className="text-[18px] text-white font-semibold mb-[16px]">
          {t('Language')}{' '}
          <span className="bg-[#E55151] rounded-full py-[2px] px-[6px] leading-[16px] text-[12px]">
            {dataLangs.length}
          </span>
        </Text>

        {/* <ArrowUpIcon /> */}
      </div>

      <div className="mb-[16px]">
        <InputText
          className="w-full text-[12px] bg-[#0a0f157f]"
          placeholder={t('Search...')}
          isFilter
          onChange={onSearch}
        />
      </div>

      <div className="flex flex-col gap-[16px] h-[140px] overflow-y-auto overflow-x-hidden">
        <CheckboxGroup value={dataLangs} onChange={onChange}>
          {langues.map((language) => (
            <Checkbox
              key={language.code}
              value={language.code}
              classNames={{
                wrapper: 'me-3 after:!bg-main before:!border-black-7',
                base: '',
              }}
              color="primary"
            >
              {language.name}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    </div>
  );
};

export default Languages;

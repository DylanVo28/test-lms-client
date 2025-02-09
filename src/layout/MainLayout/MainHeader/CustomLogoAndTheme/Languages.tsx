import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Checkbox, CheckboxGroup } from '@nextui-org/react';
import React, { useState } from 'react';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'gr', label: 'Greece' },
  { value: 'sa', label: 'Saudi Arabia' },
  { value: 'ax', label: 'Åland Islands' },
  { value: 'bh', label: 'Bahrain' },
];

const Languages = ({
  onChangeLangs,
}: {
  onChangeLangs: (value: string[]) => void;
}) => {
  const [langsSelected, setLangsSelected] = useState<string[]>([]);
  const [langues, setLangues] = useState(languages);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredLangs = languages.filter((lang) =>
      lang.label.toLowerCase().includes(value)
    );
    setLangues(filteredLangs);
  };

  const onChange = (values: string[]) => {
    onChangeLangs(values);
    setLangsSelected(values);
  };

  return (
    <div className="p-[20px] bg-[#242A30] border border-[#00000033] rounded-[4px]">
      <div className="flex justify-between">
        <Text className="text-[18px] font-semibold mb-[16px]">
          Language{' '}
          <span className="bg-[#E55151] rounded-full py-[2px] px-[6px] leading-[16px] text-[12px]">
            {langsSelected.length}
          </span>
        </Text>

        {/* <ArrowUpIcon /> */}
      </div>

      <div className="mb-[16px]">
        <InputText
          className="w-full text-[12px] bg-[#0a0f157f]"
          placeholder="Search..."
          onChange={onSearch}
        />
      </div>

      <div className="flex flex-col gap-[16px] h-[140px] overflow-y-auto">
        <CheckboxGroup value={langsSelected} onChange={onChange}>
          {langues.map((language) => (
            <Checkbox
              key={language.value}
              value={language.value}
              classNames={{
                wrapper: 'me-3 after:!bg-main before:!border-black-7',
                base: '',
              }}
              color="primary"
            >
              {language.label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    </div>
  );
};

export default Languages;

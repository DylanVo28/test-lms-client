import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { Radio, RadioGroup } from '@nextui-org/react';
import clsx from 'clsx';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
const ContenStep4 = ({
  control,
  setValue,
}: {
  control: Control;
  setValue: any;
}) => {
  const { t } = useTranslation('common');
  const DATA_CONTENT = [
    {
      id: '0-2',
      content: t('createCourse.timeSpent.veryBusy'),
    },
    {
      id: '2-4',
      content: t('createCourse.timeSpent.onTheSide'),
    },
    {
      id: '5+',
      content: t('createCourse.timeSpent.flexible'),
    },
    {
      id: 'no-time',
      content: t('createCourse.timeSpent.undecided'),
    },
  ];

  return (
    <div className="flex flex-col gap-10 items-center text-center">
      <div className="flex flex-col gap-3">
        <Text type="font-28-700" className="text-letter">
          {t('createCourse.timeSpent.question')}
        </Text>
        <Text type="font-16-400" className="text-letter/70">
          {t('createCourse.timeSpent.description')}
        </Text>
      </div>
      <div className="w-full mx-auto">
        <Controller
          name="timeSpent"
          control={control}
          render={({ field }) => {
            return (
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              >
                {DATA_CONTENT?.map((item) => {
                  return (
                    <CustomRadio
                      key={item.id}
                      value={item.id}
                      onChange={(e: any) => {
                        setValue(e.target.value);
                      }}
                    >
                      <Text
                        type="font-16-400"
                        className="text-letter max-w-[760px]"
                      >
                        {item?.content}
                      </Text>
                    </CustomRadio>
                  );
                })}
              </RadioGroup>
            );
          }}
        />
      </div>
    </div>
  );
};
export default ContenStep4;

export const CustomRadio = (props: any) => {
  const { children, value, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      size="md"
      value={value}
      classNames={{
        label: 'w-full',
        base: clsx(
          'inline-flex md:min-w-[416px] lg:min-w-[916px] max-w-full w-full m-0 bg-white-5 hover:bg-card text-start items-centers',
          'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary'
        ),
        control: 'bg-white',
        wrapper:
          '!border-1 !border-black-7 group-data-[selected=true]:!bg-main group-data-[selected=true]:!border-main',
      }}
    >
      {children}
    </Radio>
  );
};

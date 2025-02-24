import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { Radio, RadioGroup } from '@nextui-org/react';
import clsx from 'clsx';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

const DATA_CONTENT = [
  {
    id: '0-2',
    content: 'I’m very busy right now (0-2 hours)',
  },
  {
    id: '2-4',
    content: 'I’ll work on this on the side (2-4 hours)',
  },
  {
    id: '5+',
    content: 'I have lots of flexibility (5+ hours)',
  },
  {
    id: 'no-time',
    content: 'I haven’t yet decided if I have time',
  },
];

const ContenStep4 = ({
  control,
  setValue,
}: {
  control: Control;
  setValue: any;
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col gap-10 items-center text-center">
      <div className="flex flex-col gap-3">
        <Text type="font-32-700" className="text-white">
          {t('How much time can you spend creating your course per week?')}
        </Text>
        <Text type="font-16-400" className="text-black-6">
          {t(
            "There's no wrong answer. We can help you achieve your goals even if you don't have much time."
          )}
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
                        console.log('eeeeee', e.target.value);
                        setValue(e.target.value);
                      }}
                    >
                      <Text
                        type="font-16-400"
                        className="text-white max-w-[760px]"
                      >
                        {t(item?.content)}
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
          'inline-flex md:min-w-[416px] lg:min-w-[916px] max-w-full w-full m-0 bg-white-5 hover:bg-white-10 text-start items-centers',
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

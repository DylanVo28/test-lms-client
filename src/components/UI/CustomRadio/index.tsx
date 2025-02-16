import { Radio } from '@nextui-org/react';
import clsx from 'clsx';

export const CustomRadio = (props: any) => {
  const { children, value, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      size="md"
      value={value}
      classNames={{
        base: clsx(
          'inline-flex min-w-full m-0 bg-white/5 hover:bg-white/10 text-start items-centers',
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

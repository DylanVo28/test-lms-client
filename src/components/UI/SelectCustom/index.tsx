import { Select, SelectItem, SelectProps } from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';

interface IOptions {
  label: string;
  key: string | number;
}

interface SelectCustomProps {
  options: IOptions[];
  placeholder?: string;
  className?: string;
  rest?: any;
  isLesson?: boolean;
  isSelectSubmit?: boolean;
  inputDefault?: boolean;
  onChange?: any;
  value?: any;
}
const SelectCustom = (props: SelectCustomProps) => {
  const [openSelect, setOpenSelect] = useState(false);
  const {
    options,
    className = '',
    isLesson = false,
    placeholder,
    isSelectSubmit,
    inputDefault,
    onChange,
    value,
    rest,
  } = props;
  const renderSelectorIcon = (open: boolean) => {
    if (isLesson) {
      return <IconArrowDown openSelect={open} />;
    }
    if (isSelectSubmit) {
      return <IconArrowDownSubmit openSelect={open} />;
    }
    return <IconSelector openSelect={open} />;
  };
  return (
    <Select
      className={clsx('', {
        [className]: !!className,
      })}
      label=""
      labelPlacement="outside"
      radius="sm"
      onChange={onChange}
      value={value}
      selectedKeys={[value]}
      onOpenChange={(open: boolean) => {
        setOpenSelect(!open);
      }}
      placeholder={placeholder}
      classNames={{
        value: '!text-[14px] text-black-6 font-medium capitalize',
        trigger: clsx(
          '!bg-white-10 rounded min-h-[36px] border-1 border-white-10 group-data-[focus=true]:!border-main',
          {
            '!bg-transparent border-white min-h-[40px] hover:!border-main transition-all':
              isLesson,
            '!bg-[#1D2329] data-[hover=true]:!border-main  min-h-[48px] border-black-10 group-data-[focus=true]:!border-main':
              isSelectSubmit,
            '!bg-[#0A0F1580] data-[hover=true]:!border-main  min-h-[48px] border-black-10 group-data-[focus=true]:!border-main':
              inputDefault,
          }
        ),
      }}
      {...rest}
      selectorIcon={renderSelectorIcon(openSelect)}
    >
      {options.map((item) => (
        <SelectItem key={item.key} className="capitalize">
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
};
export default SelectCustom;

const IconArrowDown = ({ openSelect }: { openSelect: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className={clsx('transition-transform duration-300', {
        ['rotate-180']: openSelect,
      })}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M9.99981 10.1434L12.3565 7.78589L13.5356 8.96422L9.99981 12.5001L6.46398 8.96422L7.64314 7.78589L9.99981 10.1434Z"
        fill="white"
      />
    </svg>
  );
};

const IconArrowDownSubmit = ({ openSelect }: { openSelect: boolean }) => {
  return (
    <svg
      className={clsx('transition-transform duration-300', {
        ['rotate-180']: openSelect,
      })}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 13.1717L16.95 8.22168L18.364 9.63568L12 15.9997L5.63599 9.63568L7.04999 8.22168L12 13.1717Z"
        fill="white"
      />
    </svg>
  );
};
const IconSelector = ({ openSelect }: { openSelect: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      className={clsx('transition-transform duration-300', {
        ['rotate-180']: openSelect,
      })}
      height="10"
      viewBox="0 0 10 10"
      fill="none"
    >
      <g clip-path="url(#clip0_2001_1904)">
        <path d="M5 7.66675L1 3.66675H9L5 7.66675Z" fill="#8C8C8C" />
      </g>
      <defs>
        <clipPath id="clip0_2001_1904">
          <rect width="10" height="10" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

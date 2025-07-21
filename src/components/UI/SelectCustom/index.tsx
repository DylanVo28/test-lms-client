import { Select, SelectItem, SelectProps } from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';
import Text from '../Text';

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
  error?: string;
  hasError?: boolean;
}
const SelectCustom = (props: SelectCustomProps) => {
  const [openSelect, setOpenSelect] = useState(false);
  const {
    options,
    className = '',
    isLesson = false,
    placeholder,
    isSelectSubmit,
    hasError = false,
    inputDefault,
    onChange,
    value,
    rest,
    error,
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
    <div className="w-full">
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
        showScrollIndicators={false}
        onOpenChange={(open: boolean) => {
          setOpenSelect(!open);
        }}
        placeholder={placeholder}
        classNames={{
          value: '!text-[14px] text-letter/70 font-medium capitalize',
          trigger: clsx(
            '!bg-card rounded-md min-h-[36px] border-1 border-white-10 group-data-[focus=true]:!border-main bg-[#21252b]-30',
            {
              '!bg-card border-white min-h-[40px] hover:!border-main transition-all bg-[#21252b]-30':
                isLesson,
              '!bg-back-30 data-[hover=true]:!border-main  min-h-[48px] border-black-10  bg-[#21252b]-30 group-data-[focus=true]:!border-main':
                isSelectSubmit,
              '!bg-gray-80 data-[hover=true]:!border-main  min-h-[48px] border-black-10 bg-[#21252b]-30 group-data-[focus=true]:!border-main':
                inputDefault,
              '!border-red-500': hasError,
            }
          ),
          listboxWrapper: clsx(
            'max-h-[200px] rounded-md border z-50',
            '!bg-[#21252b] !border-[#f0f0f01a]'
          ),
          listbox: clsx('rounded-md p-1 !bg-[#21252b]'),
          popoverContent: clsx(
            'rounded-md shadow-xl border-0.5 p-0 z-50',
            '!bg-[#21252b] !border-[#f0f0f01a]'
          ),
        }}
        {...rest}
        selectorIcon={renderSelectorIcon(openSelect)}
      >
        {options.map((item) => (
          <SelectItem
            key={item.key}
            className="capitalize text-letter hover:!bg-gray-800 data-[hover=true]:!bg-gray-800 data-[selectable=true]:focus:!bg-gray-800"
          >
            {item.label}
          </SelectItem>
        ))}
      </Select>

      {error && (
        <Text type="font-14-400" className="text-danger-300 mt-1">
          {error}
        </Text>
      )}
    </div>
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
        fill="var(--theme-letter)"
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
        fill="var(--theme-letter)"
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

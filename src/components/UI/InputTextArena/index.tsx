import { InputProps, Textarea } from '@nextui-org/react';
import clsx from 'clsx';
import { ReactNode } from 'react';
import Text from '../Text';

interface InputTextProps extends InputProps {
  label?: string | ReactNode;
  placeholder?: string;
  className?: string;
  required?: boolean;
  errors?: any;
  readOnly?: boolean;
  defaultValue?: any;
  isDisabled?: boolean;
  type?: any;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full' | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  onBlur?: any;
  borderNone?: boolean;
  isError?: boolean;
  maxLength?: number;
  isFullName?: boolean;
  onChange?: any;
  isFilter?: boolean;
  isLesson?: boolean;
  isInput?: boolean;
  isInputSubmit?: boolean;
  inputDefault?: boolean;
  isBlack?: boolean;
  classInputWrapper?: string;
  minRows?: number;
}

const InputTextArena = (props: InputTextProps) => {
  const {
    startContent,
    endContent,
    label,
    errors,
    placeholder,
    type,
    radius = 'sm',
    className = '',
    borderNone = false,
    readOnly,
    isDisabled,
    required,
    defaultValue,
    onChange,
    onBlur,
    value,
    inputDefault,
    maxLength,
    isBlack,
    classInputWrapper = '',
    isError,
    isInputSubmit,
    isFullName,
    isFilter,
    name,
    isLesson,
    minRows,
    isInput,
    ...rest
  } = props;
  return (
    <div className="flex flex-col gap-2 relative justify-center">
      {label && (
        <Text type="font-16-600" className="text-white">
          {label}
        </Text>
      )}
      <Textarea
        startContent={startContent}
        endContent={
          <>
            {maxLength && (
              <div className="absolute right-3">
                <Text type="font-16-400" className="text-white-20">
                  {value && value?.length > 0
                    ? maxLength - Number(value?.length)
                    : maxLength}
                </Text>
              </div>
            )}
          </>
        }
        variant="bordered"
        type={type}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        minRows={minRows}
        radius={radius}
        className={clsx('rounded ', {
          [className]: !!className,
        })}
        label={''}
        classNames={{
          input: clsx(
            'text-black-5 font-roboto-flex text-[16px] data-[has-start-content=true]:ps-2',
            {
              'placeholder:text-white-20': isInputSubmit,
              'placeholder:!text-white-20': inputDefault,
            }
          ),

          inputWrapper: clsx(
            'px-2 border-1 rounded min-h-[40px] !border-gray-10 data-[hover=true]:!border-main group-data-[focus=true]:!border-main',
            {
              '!px-4 !bg-primary': isFilter,
              '!bg-transparent !border-white min-h-[40px] ': isLesson,
              [classInputWrapper]: classInputWrapper,

              '!bg-[#181F25] !py-[10px] !px-4  !border-none min-h-[44px] ':
                isInput,
              '!bg-[#181F25] !py-[12px] !px-[10px]  data-[hover=true]:!border-main min-h-[48px] ':
                isInputSubmit,
              '!bg-gray-80 !py-[12px] !px-[10px]  data-[hover=true]:!border-main min-h-[48px] ':
                inputDefault,
              '!bg-gray-80 !rounded !py-[12px] !px-[16px] data-[hover=true]:!border-main min-h-[50px] ':
                isBlack,
            }
          ),
        }}
        placeholder={placeholder}
        labelPlacement="outside"
      />
    </div>
  );
};
export default InputTextArena;

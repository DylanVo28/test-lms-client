import { Input, InputProps } from '@nextui-org/react';
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
  autoFocus?: boolean;
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
  classInputWrapper?: string;
  isBlack?: boolean;
  error?: string;
  hiddenMessageError?: boolean;
  inputShare?: boolean;
  isReadOnly?: boolean;
}

const InputText = (props: InputTextProps) => {
  const {
    startContent,
    endContent,
    label,
    errors,
    placeholder,
    type,
    radius = 'full',
    className = '',
    borderNone = false,
    readOnly,
    isDisabled,
    autoFocus,
    required,
    defaultValue,
    onChange,
    onBlur,
    value,
    inputDefault,
    maxLength,
    classInputWrapper = '',
    isError,
    isInputSubmit,
    isFullName,
    isFilter,
    name,
    isBlack,
    isLesson,
    error,
    hiddenMessageError,
    inputShare,
    isReadOnly,
    isInput,
    ...rest
  } = props;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If type is number, block 'e', '+', '-' and other non-numeric keys
    if (type === 'number') {
      if (['e', 'E', '+', '-'].includes(e.key)) {
        e.preventDefault();
      }
    }
  };

  const handleChange = (e: any) => {
    if (type === 'number') {
      // For number inputs, ensure only numbers and decimal points
      // This is a backup in case any non-numeric characters somehow get through
      const sanitizedValue = e.target.value.replace(/[^0-9.]/g, '');

      // If the value was changed, update it
      if (sanitizedValue !== e.target.value) {
        e.target.value = sanitizedValue;
      }
    }

    // Call the original onChange handler
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <div className="flex flex-1  flex-col gap-2 relative justify-center">
      {label && (
        <div className="flex items-center gap-1">
          <Text type="font-14-400" className="text-white">
            {label}
          </Text>
          {required && (
            <Text className="font-16-400 text-danger"> &nbsp;*</Text>
          )}
        </div>
      )}
      <Input
        startContent={startContent}
        endContent={
          <>
            {maxLength ? (
              <div className="absolute right-3 bg-black-30 px-2 rounded-sm">
                <Text type="font-16-400" className="text-white-20">
                  {value && value?.length > 0
                    ? maxLength - Number(value?.length)
                    : maxLength}
                </Text>
              </div>
            ) : (
              <>{endContent}</>
            )}
          </>
        }
        variant="bordered"
        type={type}
        maxLength={maxLength}
        autoComplete="off"
        value={value}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        onChange={handleChange}
        isDisabled={isDisabled}
        readOnly={readOnly}
        defaultValue={defaultValue}
        radius={radius}
        className={clsx('rounded ', {
          [className]: !!className,
        })}
        isReadOnly={isReadOnly}
        label={''}
        classNames={{
          input: clsx(
            'text-black-5  placeholder:!text-black-7 font-roboto-flex text-[16px] data-[has-start-content=true]:mb-[2px] data-[has-start-content=true]:ps-1',
            {
              'placeholder:text-white-20': isInputSubmit,
              'placeholder:!text-white-20': inputDefault,
              'placeholder:!text-[#757575] text-[16px] font-normal': inputShare,
            }
          ),

          inputWrapper: clsx(
            'px-2 border-1  rounded min-h-[40px] !border-gray-10 data-[hover=true]:!border-main group-data-[focus=true]:!border-main',
            {
              '!px-4 !bg-primary': isFilter,
              '!bg-transparent !border-white min-h-[40px] ': isLesson,
              [classInputWrapper]: classInputWrapper,

              '!bg-black-30 !py-[10px] !px-4  !border-none min-h-[44px] ':
                isInput,
              '!bg-black-30 !py-[12px] !px-[10px]  data-[hover=true]:!border-main min-h-[48px] ':
                isInputSubmit,
              '!bg-gray-80 !py-[12px] !px-[10px]  data-[hover=true]:!border-main min-h-[48px] ':
                inputDefault,
              '!bg-gray-80  !py-[12px] !px-[16px] data-[hover=true]:!border-main min-h-[50px] ':
                isBlack,
              '!bg-[#F0F0F0] border-1 !border-white !py-[12px] !px-[16px] data-[hover=true]:!border-white group-data-[focus=true]:!border-white':
                inputShare,
              // '!border-danger-300 data-[hover=true]:!border-danger-300': error,
            }
          ),
        }}
        placeholder={placeholder}
        labelPlacement="outside"
        {...rest}
      />
      {error && !hiddenMessageError && (
        <Text type="font-14-400" className="text-danger-300">
          {error}
        </Text>
      )}
    </div>
  );
};
export default InputText;

import { useEffect } from 'react';
import { Control, Controller, useWatch, useForm } from 'react-hook-form';
import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Tooltip } from '@nextui-org/react';
import { Info } from '@phosphor-icons/react';

const SetPrice = ({
  control,
  validationErrors,
}: {
  control: Control;
  validationErrors?: any;
}) => {
  const { setError, clearErrors, formState } = useForm({}); // Lấy các hàm hỗ trợ từ react-hook-form
  const originPrice = useWatch({ control, name: 'originPrice' });

  return (
    <div className="flex flex-col gap-8">
      <Text type="font-28-700" className="text-letter">
        {'Set Price'}
      </Text>
      <div className="flex flex-col gap-6">
        {/* Origin Price */}
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="w-[150px] flex items-center gap-1">
            <Text type="font-16-600" className="text-letter">
              {'Origin Price'}
            </Text>
            <Text className="font-16-400 text-danger"> &nbsp;*</Text>
          </div>
          <div className="col-span-4">
            <Controller
              name="originPrice"
              control={control}
              rules={{
                required: 'Origin Price is required',
                min: { value: 0, message: 'Price must be at least 0' },
              }}
              render={({ field, fieldState }) => (
                <InputText
                  endContent={
                    <Text type="font-16-400" className="text-letter">
                      USD
                    </Text>
                  }
                  error={fieldState?.error?.message}
                  type="number"
                  onChange={field.onChange}
                  value={field.value}
                  className="md:min-w-[600px]"
                  placeholder={'0'}
                  inputDefault
                  classInputWrapper={
                    validationErrors?.setPrice &&
                    (!field.value || field.value <= 0)
                      ? '!border-red-500'
                      : ''
                  }
                />
              )}
            />
          </div>
        </div>

        {/* Final Price */}
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="flex items-center gap-1 w-[150px]">
            <Text type="font-16-600" className="text-letter">
              {'Final Price'}
            </Text>
            <Text className="font-16-400 text-danger"> &nbsp;*</Text>
          </div>
          <div className="col-span-4">
            <Controller
              name="price"
              control={control}
              rules={{
                required: 'Final Price is required',
                validate: (value) => {
                  if (Number(value) > Number(originPrice)) {
                    return 'Final Price cannot be greater than Origin Price';
                  }
                  return true;
                },
              }}
              render={({ field, fieldState }) => {
                return (
                  <InputText
                    endContent={
                      <Text type="font-16-400" className="text-letter">
                        USD
                      </Text>
                    }
                    error={fieldState?.error?.message}
                    type="number"
                    onChange={field.onChange}
                    value={field.value}
                    className="md:min-w-[600px]"
                    placeholder={'0'}
                    inputDefault
                    classInputWrapper={
                      validationErrors?.setPrice &&
                      (!field.value || field.value <= 0)
                        ? '!border-red-500'
                        : ''
                    }
                  />
                );
              }}
            />
          </div>
        </div>

        {/* Promotion Period */}
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="flex items-center gap-1">
            <Text type="font-16-600" className="text-letter">
              Unlock if user trades at least
            </Text>
            <Tooltip
              content={
                <div className="p-2 text-sm">
                  <div>
                    Users who trade at least this amount on What Exchange can
                    unlock this course for free
                  </div>

                  <div className="mt-2">
                    The trading volume entered here refers to the total volume
                    traded within a 90-day period.
                  </div>
                </div>
              }
            >
              <Info size={16} className="text-letter" />
            </Tooltip>
          </div>
          <div className="col-span-4">
            <Controller
              name="unlockIfUserTradesAtLeast"
              control={control}
              render={({ field }) => (
                <InputText
                  endContent={
                    <Text type="font-16-400" className="text-letter">
                      $
                    </Text>
                  }
                  type="number"
                  onChange={field.onChange}
                  value={field.value}
                  className="md:min-w-[600px]"
                  placeholder={''}
                  inputDefault
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPrice;

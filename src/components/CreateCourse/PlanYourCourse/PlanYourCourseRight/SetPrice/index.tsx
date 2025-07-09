import { useEffect } from 'react';
import { Control, Controller, useWatch, useForm } from 'react-hook-form';
import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { useTranslation } from 'next-i18next';
import { Tooltip } from '@nextui-org/react';
import { Info } from '@phosphor-icons/react';

const SetPrice = ({ control }: { control: Control }) => {
  const { t } = useTranslation('common');
  const { setError, clearErrors, formState } = useForm({}); // Lấy các hàm hỗ trợ từ react-hook-form
  const originPrice = useWatch({ control, name: 'originPrice' });

  return (
    <div className="flex flex-col gap-8">
      <Text type="font-28-700" className="text-white">
        {t('Set Price')}
      </Text>
      <div className="flex flex-col gap-6">
        {/* Origin Price */}
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="w-[150px] flex items-center gap-1">
            <Text type="font-16-600" className="text-white">
              {t('Origin Price')}
            </Text>
            <Text className="font-16-400 text-danger"> &nbsp;*</Text>
          </div>
          <div className="col-span-4">
            <Controller
              name="originPrice"
              control={control}
              rules={{
                required: t('Origin Price is required'),
                min: { value: 0, message: t('Price must be at least 0') },
              }}
              render={({ field, fieldState }) => (
                <InputText
                  endContent={
                    <Text type="font-16-400" className="text-white">
                      USD
                    </Text>
                  }
                  error={fieldState?.error?.message}
                  type="number"
                  onChange={field.onChange}
                  value={field.value}
                  className="md:min-w-[600px]"
                  placeholder={t('0')}
                  inputDefault
                />
              )}
            />
          </div>
        </div>

        {/* Final Price */}
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="flex items-center gap-1 w-[150px]">
            <Text type="font-16-600" className="text-white">
              {t('Final Price')}
            </Text>
            <Text className="font-16-400 text-danger"> &nbsp;*</Text>
          </div>
          <div className="col-span-4">
            <Controller
              name="price"
              control={control}
              rules={{
                required: t('Final Price is required'),
                validate: (value) => {
                  if (Number(value) > Number(originPrice)) {
                    return t('Final Price cannot be greater than Origin Price');
                  }
                  return true;
                },
              }}
              render={({ field, fieldState }) => {
                return (
                  <InputText
                    endContent={
                      <Text type="font-16-400" className="text-white">
                        USD
                      </Text>
                    }
                    error={fieldState?.error?.message}
                    type="number"
                    onChange={field.onChange}
                    value={field.value}
                    className="md:min-w-[600px]"
                    placeholder={t('0')}
                    inputDefault
                  />
                );
              }}
            />
          </div>
        </div>

        {/* Promotion Period */}
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="flex items-center gap-1">
            <Text type="font-16-600" className="text-white">
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
              <Info size={16} className="text-white" />
            </Tooltip>
          </div>
          <div className="col-span-4">
            <Controller
              name="unlockIfUserTradesAtLeast"
              control={control}
              render={({ field }) => (
                <InputText
                  endContent={
                    <Text type="font-16-400" className="text-white">
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

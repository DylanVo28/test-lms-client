import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Control, Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

const SetPrice = ({ control }: { control: Control }) => {
  const { t } = useTranslation('common');
  const originPrice = useWatch({ control, name: 'originPrice' });

  return (
    <div className="flex flex-col gap-8">
      <Text type="font-28-700" className="text-white">
        {t('Set Price')}
      </Text>
      <div className="flex flex-col gap-6">
        <div className="grid md:grid-cols-6 items-center gap-4">
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
        <div className="grid md:grid-cols-6 items-center gap-4">
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
                min: { value: 0, message: t('Price must be at least 0') },
                validate: (value) =>
                  Number(value) <= Number(originPrice) ||
                  t('Final Price cannot be greater than Origin Price'),
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
        <div className="grid md:grid-cols-6 items-center gap-4">
          <div className="w-[150px]">
            <Text type="font-16-600" className="text-white">
              {t('Promotion period')}
            </Text>
          </div>
          <div className="col-span-4">
            <Controller
              name="promotionPeriod"
              control={control}
              render={({ field }) => (
                <InputText
                  endContent={
                    <Text type="font-16-400" className="text-white">
                      {t('Day')}
                    </Text>
                  }
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
      </div>
    </div>
  );
};
export default SetPrice;

import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Control, Controller, useWatch } from 'react-hook-form';

const SetPrice = ({ control }: { control: Control }) => {
  const originPrice = useWatch({ control, name: 'originPrice' });
  return (
    <div className="flex flex-col gap-8">
      <Text type="font-28-700" className="text-white">
        Set Price
      </Text>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-6 items-center gap-4">
          <div className="w-[150px]">
            <Text type="font-16-600" className="text-white">
              Origin Price
            </Text>
          </div>
          <div className="col-span-4">
            <Controller
              name="originPrice"
              control={control}
              rules={{
                required: 'Origin Price is required',
                min: { value: 0, message: 'Price must be at least 0' },
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
                    className="min-w-[600px]"
                    placeholder={'0'}
                    inputDefault
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-6 items-center gap-4">
          <div className="w-[150px]">
            <Text type="font-16-600" className="text-white">
              Final Price
            </Text>
          </div>
          <div className="col-span-4">
            <Controller
              name="price"
              control={control}
              rules={{
                required: 'Final Price is required',
                min: { value: 0, message: 'Price must be at least 0' },
                validate: (value) =>
                  value <= originPrice ||
                  'Final Price cannot be greater than Origin Price',
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
                  className="min-w-[600px]"
                  placeholder={'0'}
                  inputDefault
                />
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-6 items-center gap-4">
          <div className="w-[150px]">
            <Text type="font-16-600" className="text-white">
              Promotion period
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
                      Day
                    </Text>
                  }
                  type="number"
                  onChange={field.onChange}
                  value={field.value}
                  className="min-w-[600px]"
                  placeholder={'0'}
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

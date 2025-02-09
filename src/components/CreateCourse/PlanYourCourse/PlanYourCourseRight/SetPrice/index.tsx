import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Control, Controller } from 'react-hook-form';

const SetPrice = ({ control }: { control: Control }) => {
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
              render={({ field }) => (
                <InputText
                  endContent={
                    <Text type="font-16-400" className="text-white">
                      USD
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
              render={({ field }) => (
                <InputText
                  endContent={
                    <Text type="font-16-400" className="text-white">
                      USD
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

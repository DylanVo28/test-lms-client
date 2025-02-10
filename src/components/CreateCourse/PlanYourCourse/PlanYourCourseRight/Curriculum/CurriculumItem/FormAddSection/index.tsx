import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { Control, Controller } from 'react-hook-form';

const FormAddSection = ({
  handleCancelFormAddSection,
  control,
  handleSubmit,
  handleSaveAddSection,
  loading,
}: {
  handleCancelFormAddSection: VoidFunction;
  control: Control;
  handleSubmit: any;
  handleSaveAddSection: any;
  loading: boolean;
}) => {
  return (
    <div className="border-1 bg-[#0A0F1580] border-black-10 rounded py-4 px-3 flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <div className="min-w-[100px] pt-3">
          <Text type="font-16-700" className="text-white">
            New Section:
          </Text>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Controller
            name="title"
            control={control}
            rules={{
              required: 'Title is required',
            }}
            render={({ field, fieldState }) => {
              return (
                <InputText
                  maxLength={160}
                  endContent
                  error={fieldState?.error?.message}
                  onChange={field.onChange}
                  value={field.value}
                  className="w-full"
                  placeholder="Type"
                  inputDefault
                />
              );
            }}
          />

          <div className="flex flex-col gap-2">
            <Text type="font-16-700" className="text-white">
              What will students be able to do at the end of this section?
            </Text>
            <Controller
              name="learningObjective"
              control={control}
              render={({ field }) => {
                return (
                  <InputText
                    maxLength={160}
                    endContent
                    onChange={field.onChange}
                    value={field.value}
                    className="w-full"
                    placeholder="Type"
                    inputDefault
                  />
                );
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleCancelFormAddSection}
            className="bg-transparent border-1 rounded border-white"
          >
            <Text type="font-16-400" className="text-white">
              Cancel
            </Text>
          </Button>
          <Button
            onClick={handleSubmit(handleSaveAddSection)}
            className="bg-main rounded"
            isLoading={loading}
          >
            <Text type="font-16-400" className="text-white">
              Save
            </Text>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormAddSection;

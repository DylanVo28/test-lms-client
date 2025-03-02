import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

const FormAddSection = ({
  handleCancelFormAddSection,
  control,
  handleSubmit,
  handleSaveAddSection,
  loading,
  valueLesson,
}: {
  handleCancelFormAddSection: VoidFunction;
  control: Control;
  handleSubmit: any;
  handleSaveAddSection: any;
  loading: boolean;
  valueLesson?: any;
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="border-1 min-w-[600px]  bg-gray-80 border-black-10 rounded py-4 px-3 flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <div className="min-w-[100px] pt-3">
          <Text type="font-16-700" className="text-white">
            {valueLesson?.id
              ? `${t('Part')} ${valueLesson?.stt}`
              : t('New Section:')}
          </Text>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Controller
            name="title"
            control={control}
            rules={{
              required: t('Title is required'),
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
                  placeholder={t('Type')}
                  inputDefault
                />
              );
            }}
          />

          <div className="flex flex-col gap-2">
            <Text type="font-16-700" className="text-white">
              {t(
                'What will students be able to do at the end of this section?'
              )}
            </Text>
            <Controller
              name="learningObjective"
              control={control}
              render={({ field }) => {
                return (
                  <InputText
                    maxLength={160}
                    defaultValue={valueLesson?.learningObjective}
                    endContent
                    onChange={field.onChange}
                    value={field.value}
                    className="w-full"
                    placeholder={t('Type')}
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
            onPress={handleCancelFormAddSection}
            variant="light"
            className="rounded"
          >
            <Text type="font-16-400" className="text-white">
              {t('Cancel')}
            </Text>
          </Button>
          <Button
            onPress={handleSubmit(handleSaveAddSection)}
            className="bg-main rounded"
            isLoading={loading}
          >
            <Text type="font-16-400" className="text-text-white">
              {t('Save')}
            </Text>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormAddSection;

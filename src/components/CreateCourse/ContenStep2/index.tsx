import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
const ContenStep2 = ({ control }: { control: Control }) => {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col gap-10 items-center text-center">
      <div className="flex flex-col gap-3">
        <Text type="font-28-700" className="text-letter">
          {t('createCourse.workingTitle')}
        </Text>
        <Text type="font-16-400" className="text-letter/70">
          {t('createCourse.titleDescription')}
        </Text>
      </div>
      <div className="w-full">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <InputText
              maxLength={60}
              className="md:min-w-[620px] w-full"
              placeholder={t('createCourse.titlePlaceholder')}
              value={field.value}
              onChange={field.onChange}
              isInputSubmit
            />
          )}
        />
      </div>
    </div>
  );
};
export default ContenStep2;

import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

const ContenStep2 = ({ control }: { control: Control }) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col gap-10 items-center text-center">
      <div className="flex flex-col gap-3">
        <Text type="font-32-700" className="text-white">
          {t('How about a working title?')}
        </Text>
        <Text type="font-16-400" className="text-black-6">
          {t(
            "It's ok if you can't think of a good title now. You can change it later."
          )}
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
              placeholder={t('e.g Learn photoshop CS6 from Scratch')}
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

import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';

const LearningTools = () => {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col mt-2 gap-5 pl-[80px]">
      <div className="flex flex-col gap-1">
        <Text type="font-18-600" className="text-white">
          {t('Mobile notifications')}
        </Text>
        <Text className="text-black-7" type="font-14-400">
          {t('Receive learning reminders on your mobile device.')}
        </Text>
      </div>
      <div className="max-w-[443px] flex flex-col gap-2">
        <Text className="text-white" type="font-16-500">
          {t('Phone')}
        </Text>
        <div className="flex flex-col gap-4">
          <InputText isInput placeholder={t('+84 (Viet Nam)')} />
          <InputText isInput placeholder={t('123 456 789')} />
          <Button className="rounded bg-main min-h-[44px]">
            <Text type="font-16-700" className="text-white">
              {t('Send')}
            </Text>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default LearningTools;

import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';

const Footer = ({
  currentStep,
  handleClickNextStep,
  handlePreviousStep,
  loading,
  watch,
}: {
  handleClickNextStep: (step: number) => void;
  handlePreviousStep: (step: number) => void;
  watch?: any;
  loading?: boolean;

  currentStep: number;
}) => {
  const { t } = useTranslation('common');
  const typeWatch = watch('type');
  const titleWatch = watch('title');
  const categoryWatch = watch('categoryId');
  const timeSpentWatch = watch('timeSpent');

  return (
    <div className="py-[26px] px-[40px] min-h-[96px] bg-[#1D2228] w-full flex justify-between items-center">
      {currentStep === 1 && (
        <div className="flex justify-center items-center w-full">
          <Button
            isDisabled={!typeWatch}
            onPress={() => handleClickNextStep(currentStep)}
            className="bg-main rounded py-[10px] px-6"
          >
            <Text type="font-16-700" className="text-white">
              {t('Continue')}
            </Text>
          </Button>
        </div>
      )}
      {currentStep !== 1 && (
        <>
          <Button
            onPress={() => handlePreviousStep(currentStep)}
            className="bg-transparent border-1 border-main rounded py-[10px] px-6"
          >
            <Text type="font-16-700" className="text-white">
              {t('Previous')}
            </Text>
          </Button>
          <Button
            isDisabled={
              currentStep === 2
                ? !titleWatch
                : currentStep === 3
                ? !categoryWatch
                : !timeSpentWatch
            }
            isLoading={loading}
            onPress={() => handleClickNextStep(currentStep)}
            className="bg-main rounded py-[10px] px-6"
          >
            <Text type="font-16-700" className="text-white">
              {t('Continue')}
            </Text>
          </Button>
        </>
      )}
    </div>
  );
};
export default Footer;

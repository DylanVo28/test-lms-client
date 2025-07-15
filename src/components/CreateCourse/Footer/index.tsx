import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { TYPE_CREATE_COURSE } from '../ContenStep1';

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
  const typeWatch = watch('type');
  const courseIdWatch = watch('courseId');
  const titleWatch = watch('title');

  const categoryWatch = watch('categoryId');
  const timeSpentWatch = watch('timeSpent');

  return (
    <div className="py-[26px] px-[40px] min-h-[96px] bg-black-50 w-full flex justify-between items-center">
      {currentStep === 1 && (
        <div className="flex justify-center items-center w-full">
          <Button
            isDisabled={!typeWatch}
            onPress={() => handleClickNextStep(currentStep)}
            className="bg-main rounded py-[10px] px-6"
          >
            <Text type="font-16-700" className="text-text-white">
              {'Continue'}
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
              {'Previous'}
            </Text>
          </Button>
          {typeWatch === TYPE_CREATE_COURSE?.PREMADE_CONTENT ? (
            <Button
              isDisabled={!courseIdWatch}
              isLoading={loading}
              onPress={() => handleClickNextStep(currentStep)}
              className="bg-main rounded py-[10px] px-6"
            >
              <Text type="font-16-700" className="text-white">
                {'Duplicate'}
              </Text>
            </Button>
          ) : (
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
                {'Continue'}
              </Text>
            </Button>
          )}
        </>
      )}
    </div>
  );
};
export default Footer;

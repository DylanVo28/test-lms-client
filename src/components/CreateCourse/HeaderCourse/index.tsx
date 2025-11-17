import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import { Button, Progress } from '@nextui-org/react';
import Image from 'next/image';
import { atom, useAtom } from 'jotai';
import useNavigate from '@/hooks/useNavigate';
import { useTranslation } from 'next-i18next';
import ImageCustom from "@/components/UI/ImageCustom";

export const totalStepAtom = atom<number>(4);

const HeaderCourse = ({ currentStep = 1 }: { currentStep: number }) => {
  const { navigate } = useNavigate();
  const { t } = useTranslation('common');
  const [totalStep] = useAtom(totalStepAtom);

  return (
    <div>
      <div className="p-4 flex justify-between items-center">
        <ImageCustom
          onClick={() => navigate(ROUTE_PATH.HOME)}
          alt="logo"
          width={125}
          height={46}
          src={'/logo.png'}
        />
        <Text type="font-16-500" className="text-letter">
          {t('createCourse.stepProgress', {
            current: currentStep,
            total: totalStep,
          })}
        </Text>

        <Button
          className="py-2 px-4 bg-transparent border-1 border-black-5 rounded"
          onPress={() => navigate(ROUTE_PATH.LIST_COURSE)}
        >
          <Text type="font-16-500" className="text-letter">
            {t('createCourse.exit')}
          </Text>
        </Button>
      </div>
      <Progress
        maxValue={totalStep}
        classNames={{
          indicator: 'bg-main',
          track: 'max-h-[8px]',
        }}
        className="w-full"
        value={currentStep}
      />
    </div>
  );
};
export default HeaderCourse;

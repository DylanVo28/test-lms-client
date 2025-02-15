import { Control } from 'react-hook-form';
import IntendedLearners from './IntendedLearners';
import Curriculum from './Curriculum';
import dynamic from 'next/dynamic';
import Referral from './Referral';
import SetPrice from './SetPrice';
import { useTranslation } from 'next-i18next';

const CourseLandingPage = dynamic(() => import('./CourseLandingPage'), {
  ssr: false,
});

const PlanYourCourseRight = ({
  activePlan,
  control,
  watch,
  idDetail,
  handleSubmit,
  setValue,
}: {
  control: Control;
  activePlan: number;
  idDetail: string;
  handleSubmit: any;
  watch?: any;
  setValue: any;
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="bg-[#181F25] p-4 md:py-6 md:px-8 flex flex-col rounded shadow-lg w-full gap-8">
      {activePlan === 1 && (
        <IntendedLearners
          handleSubmit={handleSubmit}
          control={control}
          idDetail={idDetail}
        />
      )}
      {activePlan === 2 && <Curriculum setValue={setValue} />}
      {activePlan === 3 && (
        <CourseLandingPage watch={watch} control={control} />
      )}
      {activePlan === 4 && <Referral control={control} />}
      {activePlan === 5 && <SetPrice control={control} />}
    </div>
  );
};
export default PlanYourCourseRight;

import { Control } from 'react-hook-form';
import IntendedLearners from './IntendedLearners';
import Curriculum from './Curriculum';
import dynamic from 'next/dynamic';
import Referral from './Referral';
import SetPrice from './SetPrice';
const CourseLandingPage = dynamic(
  () =>
    import(
      '@/components/CreateCourse/PlanYourCourse/PlanYourCourseRight/CourseLandingPage'
    ),
  {
    ssr: false,
  }
);

const PlanYourCourseRight = ({
  activePlan,
  control,
  errors,
  watch,
  idDetail,
  handleSubmit,
  setValue,
}: {
  control: Control;
  activePlan: number;
  errors: any;
  idDetail: string;
  handleSubmit: any;
  watch?: any;
  setValue: any;
}) => {
  return (
    <div className="bg-gray-70 p-4 md:py-6 md:px-8 flex flex-col rounded shadow-lg w-full gap-8">
      {activePlan === 1 && (
        <IntendedLearners
          handleSubmit={handleSubmit}
          errors={errors}
          control={control}
          idDetail={idDetail}
        />
      )}
      {activePlan === 2 && <Curriculum setValue={setValue} />}
      {activePlan === 3 && (
        <CourseLandingPage watch={watch} control={control} />
      )}
      {/* {activePlan === 4 && <Referral control={control} />} */}
      {activePlan === 4 && <SetPrice control={control} />}
    </div>
  );
};
export default PlanYourCourseRight;

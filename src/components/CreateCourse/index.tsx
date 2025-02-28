import { useEffect, useState } from 'react';
import HeaderCourse from './HeaderCourse';
import Footer from './Footer';
import ContenStep1, { TYPE_CREATE_COURSE } from './ContenStep1';
import ContenStep2 from './ContenStep2';
import ContenStep3 from './ContenStep3';
import ContenStep4 from './ContenStep4';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useCreateCourse, useDuplicateCourse } from './service';
import { toast } from '../UI/Toast/toast';
import { useTranslation } from 'next-i18next';
import ContenStepDuplicateCourse from './ContenStepDuplicateCourse';

const CreateCourse = () => {
  const { t } = useTranslation('common');
  const [step, setStep] = useState(1);
  const router = useRouter();

  const { run: runCreateCourse, loading } = useCreateCourse({
    onSuccess(res) {
      router.push(`/create-course/${res?.data?.id}`);
      toast.success(res?.message);
    },
  });

  const { run: runDuplicateCourse } = useDuplicateCourse({
    onSuccess(res) {
      router.push(`/list-course`);
      toast.success(res?.message);
    },
  });

  const handleClickNextStep = (step: number) => {
    if (step === 4 && typeWatch === TYPE_CREATE_COURSE.COURSE) {
      const values = getValues();
      const body = {
        title: values?.title,
        categoryId: values.categoryId,
        type: values.type,
        timeSpent: values.timeSpent,
        // timeSpent: 'im so busy',
      };
      runCreateCourse(body);
      return;
    }
    if (step === 2 && typeWatch === TYPE_CREATE_COURSE.PREMADE_CONTENT) {
      const values = getValues();
      // const body = {
      //   title: values?.title,
      //   categoryId: values.categoryId,
      //   type: values.type,
      //   timeSpent: values.timeSpent,
      //   // timeSpent: 'im so busy',
      // };
      runDuplicateCourse(values.courseId);
      return;
    }
    setStep(step + 1);
  };
  const handlePreviousStep = (step: number) => {
    setStep(step - 1);
  };

  const {
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    setValue('type', 'COURSE');
  }, []);

  const typeWatch = watch('type');

  console.log(step, 'step');

  return (
    <form>
      <div className="bg-primary w-screen h-[100dvh] overflow-auto">
        <HeaderCourse currentStep={step} />
        <div className="flex justify-center min-h-[calc(100dvh-82px-96px)] px-4 md:px-4 lg:px-0 pt-[92px]">
          {step === 1 && <ContenStep1 control={control} />}
          {step === 2 && typeWatch === TYPE_CREATE_COURSE?.COURSE && (
            <ContenStep2 control={control} />
          )}
          {step === 2 && typeWatch === TYPE_CREATE_COURSE?.PREMADE_CONTENT && (
            <ContenStepDuplicateCourse control={control} />
          )}

          {step === 3 && <ContenStep3 control={control} />}
          {step === 4 && <ContenStep4 control={control} setValue={setValue} />}
        </div>
        <Footer
          watch={watch}
          handlePreviousStep={handlePreviousStep}
          handleClickNextStep={handleClickNextStep}
          currentStep={step}
          loading={loading}
        />
      </div>
    </form>
  );
};
export default CreateCourse;

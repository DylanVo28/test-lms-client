import HeaderPlanYourCourse from './HeaderPlanYourCourse';
import PlanYourCourseLeft from './PlanYourCourseLeft';
import PlanYourCourseRight from './PlanYourCourseRight';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ROUTE_PATH, TYPE_COURSE } from '@/utils/const';
import { useRouter } from 'next/router';
import { useEditCourse, useGetDetailCourse } from '../service';
import { toast } from '@/components/UI/Toast/toast';
import LoadingScreen from '@/components/UI/LoadingScreen';
import { useProfile } from '@/store/profile/useProfile';

const PlanYourCourse = () => {
  const [activePlan, setActivePlan] = useState(1);
  const router = useRouter();
  const { profile } = useProfile();
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    run: getDetailCourse,
    loading,
    data: dataDetail,
  } = useGetDetailCourse({
    onSuccess: (res) => {
      const isEnoughtSetPrice = res?.data?.price && res?.data?.originPrice;
      const isEnoughIntendedLearners =
        res?.data?.objectives?.length > 0 &&
        res?.data?.intenedLeaners?.length > 0 &&
        res?.data?.requirements?.length > 0;

      const isEnoughCourseLangdingePage =
        res?.data?.title && res?.data?.categoryId;

      const isEnoughCurruclum = res?.data?.sections?.some(
        (item: any) =>
          (item.lessons && item.lessons.length > 0) ||
          (item.quizzes && item.quizzes.length > 0)
      );
      if (
        isEnoughIntendedLearners &&
        isEnoughCurruclum &&
        isEnoughtSetPrice &&
        isEnoughCourseLangdingePage &&
        isSubmit
      ) {
        router.push(ROUTE_PATH.LIST_COURSE);
      }

      reset({
        objectives: res?.data?.objectives?.map((item: any) => {
          return {
            name: item,
          };
        }),
        requirements: res?.data?.requirements?.map((item: any) => {
          return {
            name: item,
          };
        }),
        intenedLeaners: res?.data?.intenedLeaners?.map((item: any) => {
          return {
            name: item,
          };
        }),
        lang: res?.data?.lang,
        level: res?.data?.level,
        subtitle: res?.data?.subtitle,
        title: res?.data?.title,
        description: res?.data?.description,
        topics: res?.data?.topics?.[0],
        image: res?.data?.image,
        video: res?.data?.video,
        subCategoryId: res?.data?.subCategoryId,
        price: res?.data?.price,
        originPrice: res?.data?.originPrice,
        promotionPeriod: res?.data?.promotionPeriod,
        categoryId: res?.data?.categoryId,
        sections: [
          {
            title: 'Section 1',
            introduction: 'introduction',
            curriculums: [
              {
                title: 'Lecture 1',
                introduction: 'introduction',
                type: TYPE_COURSE.LECTURE,
              },
            ],
          },
        ],
      });
    },
  });

  const { control, handleSubmit, reset, watch } = useForm<any>({
    defaultValues: {
      objectives: [{ name: '' }, { name: '' }, { name: '' }, { name: '' }],
      requirements: [{ name: '' }],
      intenedLeaners: [{ name: '' }],
      items: [{ type: '' }, { type: '' }, { type: '' }, { type: '' }],
      items1: [{ type: '' }],
      items2: [{ type: '' }],
    },
  });

  useEffect(() => {
    if (router.query.id) {
      getDetailCourse(router.query.id as string, profile?.id);
    }
  }, [router.query.id, profile?.id]);
  const requestEditCourse = useEditCourse({
    onSuccess: (res: any) => {
      getDetailCourse(router.query.id as string);
      toast.success(res?.message);
      setIsSubmit(true);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const requestEditPublishCourse = useEditCourse({
    onSuccess: (res: any) => {
      toast.success(res?.message);
      router.push(ROUTE_PATH.LIST_COURSE);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const onPublish = (values: any) => {
    const body: any = {
      isPublish: true,
      objectives: values?.objectives
        ?.filter((v: any) => !!v?.name)
        ?.map((item: any) => item?.name),
      requirements: values?.requirements
        ?.filter((v: any) => !!v?.name)
        ?.map((item: any) => item?.name),
      intenedLeaners: values?.intenedLeaners
        ?.filter((v: any) => !!v?.name)
        ?.map((item: any) => item?.name),
      description: values?.description,
      image: values?.image,
      video: values?.video,
      subtitle: values?.subtitle,
      title: values?.title,
      subCategoryId: values?.subCategoryId,
      categoryId: values?.categoryId,
      topics: [values.topics],
      lang: values.lang,
      level: values.level,

      price: values?.price,
      originPrice: values?.originPrice,
      promotionPeriod: values?.promotionPeriod,
    };
    if (!values.topics) {
      delete body.topics;
    }
    const filteredBody = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => {
        return (
          value !== undefined &&
          value !== null &&
          (Array.isArray(value) ? value.length > 0 : value !== '')
        );
      })
    );
    requestEditPublishCourse.run(filteredBody, router.query.id as string);
  };
  const onSubmit = (values: any) => {
    const body: any = {
      objectives: values?.objectives
        ?.filter((v: any) => !!v?.name)
        ?.map((item: any) => item?.name),
      requirements: values?.requirements
        ?.filter((v: any) => !!v?.name)
        ?.map((item: any) => item?.name),
      intenedLeaners: values?.intenedLeaners
        ?.filter((v: any) => !!v?.name)
        ?.map((item: any) => item?.name),
      description: values?.description,
      image: values?.image,
      video: values?.video,
      subtitle: values?.subtitle,
      title: values?.title,
      subCategoryId: values?.subCategoryId,
      categoryId: values?.categoryId,
      topics: [values.topics],
      lang: values.lang,
      level: values.level,

      price: values?.price,
      originPrice: values?.originPrice,
      promotionPeriod: values?.promotionPeriod,
    };
    if (!values.topics) {
      delete body.topics;
    }
    const filteredBody = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => {
        return (
          value !== undefined &&
          value !== null &&
          (Array.isArray(value) ? value.length > 0 : value !== '')
        );
      })
    );
    requestEditCourse.run(filteredBody, router.query.id as string);
  };

  const isEnoughtSetPrice =
    dataDetail?.data?.price && dataDetail?.data?.originPrice;
  const isEnoughIntendedLearners =
    dataDetail?.data?.objectives?.length > 0 &&
    dataDetail?.data?.intenedLeaners?.length > 0 &&
    dataDetail?.data?.requirements?.length > 0;

  const isEnoughCourseLangdingePage =
    dataDetail?.data?.title && dataDetail?.data?.categoryId;

  const isEnoughCurruclum = dataDetail?.data?.sections?.some(
    (item: any) =>
      (item.lessons && item.lessons.length > 0) ||
      (item.quizzes && item.quizzes.length > 0)
  );

  useEffect(() => {
    if (
      isEnoughIntendedLearners ||
      isEnoughCurruclum ||
      isEnoughCourseLangdingePage
    ) {
      setActivePlan(activePlan + 1);
    }
  }, [
    isEnoughIntendedLearners,
    isEnoughCurruclum,
    isEnoughCourseLangdingePage,
  ]);

  return (
    <LoadingScreen isLoading={loading}>
      <form>
        <div className="bg-primary w-screen h-[100dvh] overflow-auto pb-10">
          <HeaderPlanYourCourse
            loading={requestEditCourse?.loading}
            loadingPublish={requestEditPublishCourse?.loading}
            handleSaveForm={handleSubmit(onSubmit)}
            handlePublishForm={handleSubmit(onPublish)}
          />
          <div className="w-11/12 mx-auto pt-10">
            <div className="grid grid-cols-10 gap-12">
              <div className="col-span-2">
                <PlanYourCourseLeft
                  isEnoughtSetPrice={isEnoughtSetPrice}
                  isEnoughCourseLangdingePage={isEnoughCourseLangdingePage}
                  isEnoughCurruclum={isEnoughCurruclum}
                  isEnoughIntendedLearners={isEnoughIntendedLearners}
                  activePlan={activePlan}
                  handleActivePlan={(plan) => setActivePlan(plan)}
                />
              </div>
              <div className="col-span-8">
                <PlanYourCourseRight
                  handleSubmit={handleSubmit}
                  watch={watch}
                  idDetail={router.query.id as string}
                  control={control}
                  activePlan={activePlan}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </LoadingScreen>
  );
};
export default PlanYourCourse;

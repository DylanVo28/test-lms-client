import HeaderPlanYourCourse from './HeaderPlanYourCourse';
import PlanYourCourseLeft from './PlanYourCourseLeft';
import PlanYourCourseRight from './PlanYourCourseRight';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ROUTE_PATH, TYPE_COURSE } from '@/utils/const';
import { useRouter } from 'next/router';
import { useEditCourse, useGetDetailCourse } from '../service';
import { toast } from '@/components/UI/Toast/toast';
import LoadingScreen from '@/components/UI/LoadingScreen';
import { useProfile } from '@/store/profile/useProfile';
import ModalSubmitError from './ModalSubmitError';
import { API_PATH } from '@/api/constant';
import { PREFIX_API } from '@/api/request';
import Text from '@/components/UI/Text';
import { useTranslation } from 'next-i18next';
import useNavigate from '@/hooks/useNavigate';
import { set } from 'video.js/dist/types/tech/middleware';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useAccount } from 'wagmi';

const PlanYourCourse = () => {
  const { t } = useTranslation('common');
  const [activePlan, setActivePlan] = useState(1);
  const router = useRouter();
  const { profile } = useProfile();
  const [isSubmit, setIsSubmit] = useState(false);
  const [loadingFetchDetail, setLoadingFetchDetail] = useState(false);

  const [isNextStepSubmit, setIsNextStepSubmit] = useState(false);

  const { navigate } = useNavigate();

  const dataObjectivesDefault = [
    {
      name: '',
      pladholder: t(
        'Example: Identifying the roles and responsibilities of a project manager'
      ),
    },
    {
      name: '',
      pladholder: t('Example: Project schedule and budget estimates'),
    },
    {
      name: '',
      pladholder: t('Example: Identifying and Managing Project Risks'),
    },
    {
      name: '',
      pladholder: t(
        'Example: Complete a case study for managing a project from concept to completion'
      ),
    },
  ];

  const dataRequirementsDefault = [
    {
      name: '',
      pladholder: t(
        'For example: No programming experience required. You will learn everything you need to know.'
      ),
    },
  ];

  const dataIntenedLeanersDefault = [
    {
      name: '',
      pladholder: t(
        'Example: Entry-level Python developers who want to learn data science'
      ),
    },
  ];

  const [dataSections, setDataSections] = useState([]);

  const refModalSubmitError: any = useRef(null);
  const { address } = useAccount();
  const accessToken = useAccessToken();

  const {
    run: getDetailCourse,
    loading,
    data: dataDetailRes,
  } = useGetDetailCourse({
    onSuccess: async (courseDetailRes) => {
      const courseDetail = courseDetailRes?.data ?? {};

      const isEnoughtSetPrice =
        courseDetail?.price && courseDetail?.originPrice;
      const isEnoughIntendedLearners =
        courseDetail?.objectives?.length > 0 &&
        courseDetail?.intenedLeaners?.length > 0 &&
        courseDetail?.requirements?.length > 0;

      const isEnoughCourseLangdingePage =
        courseDetail?.title && courseDetail?.categoryId;
      courseDetail?.level && courseDetail?.lang;

      const detailSectionRes = await fetchDetailSection();
      const detailSection = detailSectionRes?.data;

      const allLessonsHaveContent =
        Array.isArray(detailSection) &&
        detailSection?.length > 0 &&
        detailSection?.every((section: any) => {
          if (section.lessons.length === 0) {
            return section.quizzes.length > 0;
          }

          return section.lessons.every(
            (lesson: any) =>
              (lesson.id &&
                (!!lesson.content || !!lesson.info?.thumbnailUrl)) ||
              !lesson.id
          );
        });

      const allQuizzesHaveQuestions =
        Array.isArray(detailSection) &&
        detailSection?.length > 0 &&
        detailSection?.every((section: any) => {
          if (section.quizzes.length === 0) {
            return section.lessons.length > 0;
          }

          return section.quizzes.every(
            (quizz: any) =>
              (quizz.id &&
                Array.isArray(quizz.questions) &&
                quizz.questions.length > 0) ||
              !quizz.id
          );
        });

      const isEnoughCurruclum =
        allLessonsHaveContent && allQuizzesHaveQuestions;

      if (
        isEnoughIntendedLearners &&
        isEnoughCurruclum &&
        isEnoughtSetPrice &&
        isEnoughCourseLangdingePage &&
        isSubmit &&
        !isNextStepSubmit
      ) {
        navigate(ROUTE_PATH.LIST_COURSE);
      }

      reset({
        objectives:
          courseDetail?.objectives?.length > 0
            ? courseDetail?.objectives?.map((item: any) => {
                return {
                  name: item,
                };
              })
            : dataObjectivesDefault,
        requirements:
          courseDetail?.requirements?.length > 0
            ? courseDetail?.requirements?.map((item: any) => {
                return {
                  name: item,
                };
              })
            : dataRequirementsDefault,
        intenedLeaners:
          courseDetail?.intenedLeaners?.length > 0
            ? courseDetail?.intenedLeaners?.map((item: any) => {
                return {
                  name: item,
                };
              })
            : dataIntenedLeanersDefault,
        lang: courseDetail?.lang,
        level: courseDetail?.level,
        subtitle: courseDetail?.subtitle,
        title: courseDetail?.title,
        description: courseDetail?.description,
        topics: courseDetail?.topics?.[0],
        image: courseDetail?.image,
        video: courseDetail?.video,
        subCategoryId: courseDetail?.subCategoryId,
        price: courseDetail?.price,
        originPrice: courseDetail?.originPrice,
        promotionPeriod: courseDetail?.promotionPeriod,
        categoryId: courseDetail?.categoryId,
      });
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      objectives: [{ name: '' }, { name: '' }, { name: '' }, { name: '' }],
      requirements: [{ name: '' }],
      intenedLeaners: [{ name: '' }],
      items: [{ type: '' }, { type: '' }, { type: '' }, { type: '' }],
      items1: [{ type: '' }],
      items2: [{ type: '' }],
    },
  });

  const fieldValue = watch();

  console.log('fieldValue:::', fieldValue);

  useEffect(() => {
    if (router.query.id) {
      getDetailCourse(router.query.id as string, profile?.id);
      fetchDetailSection();
    }
  }, [router.query.id, profile?.id]);

  const requestEditCourse = useEditCourse({
    onSuccess: async (res: any) => {
      const resData = await fetchDetailSection();

      const allLessonsHaveContent =
        Array.isArray(resData?.data) &&
        resData?.data.length > 0 &&
        resData?.data.every((section: any) => {
          if (section.lessons.length === 0) {
            return section.quizzes.length > 0;
          }

          return section.lessons.every(
            (lesson: any) =>
              (lesson.id &&
                (!!lesson.content || !!lesson.info?.thumbnailUrl)) ||
              !lesson.id
          );
        });

      const allQuizzesHaveQuestions =
        Array.isArray(resData?.data) &&
        resData?.data.length > 0 &&
        resData?.data.every((section: any) => {
          if (section.quizzes.length === 0) {
            return section.lessons.length > 0;
          }

          return section.quizzes.every(
            (quizz: any) =>
              (quizz.id &&
                Array.isArray(quizz.questions) &&
                quizz.questions.length > 0) ||
              !quizz.id
          );
        });

      const isEnoughIntendedLearners =
        res?.data?.objectives?.length > 0 &&
        res?.data?.intenedLeaners?.length > 0 &&
        res?.data?.requirements?.length > 0;
      const isEnoughCourseLangdingePage =
        res?.data?.title &&
        res?.data?.categoryId &&
        res?.data?.level &&
        res?.data?.lang;
      if (isEnoughIntendedLearners && activePlan === 1 && !isNextStepSubmit) {
        setActivePlan(activePlan + 1);
      }
      if (
        allLessonsHaveContent &&
        allQuizzesHaveQuestions &&
        activePlan === 2 &&
        !isNextStepSubmit
      ) {
        setActivePlan(activePlan + 1);
      }
      if (
        isEnoughCourseLangdingePage &&
        activePlan === 3 &&
        !isNextStepSubmit
      ) {
        setActivePlan(activePlan + 1);
      }

      getDetailCourse(router.query.id as string);
      setIsSubmit(true);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const requestEditPublishCourse = useEditCourse({
    onSuccess: (res: any) => {
      toast.success(res?.message);
      navigate(ROUTE_PATH.LIST_COURSE);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const fetchDetailSection = async () => {
    setLoadingFetchDetail(true);
    try {
      const params = new URLSearchParams({
        courseId: router.query.id as string,
        userId: profile?.id,
        order: 'createdAt asc',
      }).toString();

      const res = await fetch(`${PREFIX_API}${API_PATH.SECTIONS}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setLoadingFetchDetail(false);

      setDataSections(data?.data);

      return data;
    } catch (error) {}
  };

  const onPublish = async (values: any) => {
    const resData = await fetchDetailSection();

    const allLessonsHaveContent =
      Array.isArray(resData?.data) &&
      resData?.data.length > 0 &&
      resData?.data.every((section: any) => {
        if (section.lessons.length === 0) {
          return section.quizzes.length > 0;
        }

        return section.lessons.every(
          (lesson: any) =>
            (lesson.id && (!!lesson.content || !!lesson.info?.thumbnailUrl)) ||
            !lesson.id
        );
      });
    const allQuizzesHaveQuestions =
      Array.isArray(resData?.data) &&
      resData?.data.length > 0 &&
      resData?.data.every((section: any) => {
        if (section.quizzes.length === 0) {
          return section.lessons.length > 0;
        }

        return section.quizzes.every(
          (quizz: any) =>
            (quizz.id &&
              Array.isArray(quizz.questions) &&
              quizz.questions.length > 0) ||
            !quizz.id
        );
      });

    const isEnoughtSetPrice = values?.price && values?.originPrice;
    const isEnoughIntendedLearners =
      values?.objectives?.length > 0 &&
      values?.intenedLeaners?.length > 0 &&
      values?.requirements?.length > 0;
    const isEnoughCourseLangdingePage =
      values?.title && values?.categoryId && values?.level && values?.lang;
    if (isEnoughIntendedLearners && activePlan === 1) {
      setActivePlan(activePlan + 1);
    }
    if (allLessonsHaveContent && allQuizzesHaveQuestions && activePlan === 2) {
      setActivePlan(activePlan + 1);
    }
    if (isEnoughCourseLangdingePage && activePlan === 3) {
      setActivePlan(activePlan + 1);
    }
    if (
      (!allLessonsHaveContent && !allQuizzesHaveQuestions) ||
      !isEnoughtSetPrice ||
      !isEnoughIntendedLearners ||
      !isEnoughCourseLangdingePage
    ) {
      const dataError = {
        dataCurriculum: resData?.data,
        ...values,
      };
      refModalSubmitError.current.onOpen(dataError);
      return;
    }
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
    setIsNextStepSubmit(false);

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
    setIsNextStepSubmit(false);
    requestEditCourse.run(filteredBody, router.query.id as string);
  };

  const dataDetail = dataDetailRes?.data;

  const isEnoughtSetPrice = dataDetail?.price && dataDetail?.originPrice;
  const isEnoughIntendedLearners =
    dataDetail?.objectives?.length > 0 &&
    dataDetail?.intenedLeaners?.length > 0 &&
    dataDetail?.requirements?.length > 0;

  const isEnoughCourseLangdingePage =
    dataDetail?.title &&
    dataDetail?.categoryId &&
    dataDetail?.level &&
    dataDetail?.lang;

  const allLessonsHaveContent =
    Array.isArray(dataSections) &&
    dataSections.length > 0 &&
    dataSections.every((section: any) => {
      if (section.lessons.length === 0) {
        return section.quizzes.length > 0;
      }

      return section.lessons.every(
        (lesson: any) =>
          (lesson.id && (!!lesson.content || !!lesson.info?.thumbnailUrl)) ||
          !lesson.id
      );
    });

  const allQuizzesHaveQuestions =
    Array.isArray(dataSections) &&
    dataSections.length > 0 &&
    dataSections.every((section: any) => {
      if (section.quizzes.length === 0) {
        return section.lessons.length > 0;
      }

      return section.quizzes.every(
        (quizz: any) =>
          (quizz.id &&
            Array.isArray(quizz.questions) &&
            quizz.questions.length > 0) ||
          !quizz.id
      );
    });

  const isEnoughCurruclum = allLessonsHaveContent && allQuizzesHaveQuestions;

  const handleChangeTab = (plan: number) => {
    setActivePlan(plan);

    if (activePlan < plan) {
      setIsNextStepSubmit(true);
      const values = getValues();

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
    }
  };

  return (
    <div>
      <form>
        <div className="bg-primary w-screen h-[100dvh] overflow-auto pb-10">
          <HeaderPlanYourCourse
            loading={requestEditCourse?.loading}
            loadingPublish={requestEditPublishCourse?.loading}
            handleSaveForm={handleSubmit(onSubmit)}
            handlePublishForm={handleSubmit(onPublish)}
          />
          <div className="w-11/12 mx-auto pt-10">
            <div className="grid grid-cols-10 gap-10 md:gap-12">
              <div className="col-span-10 md:col-span-2">
                <div className="flex flex-col gap-4">
                  <Text type="font-18-600">{t('Plan your course')}</Text>
                  <PlanYourCourseLeft
                    isEnoughtSetPrice={isEnoughtSetPrice}
                    isEnoughCourseLangdingePage={isEnoughCourseLangdingePage}
                    isEnoughCurruclum={isEnoughCurruclum}
                    isEnoughIntendedLearners={isEnoughIntendedLearners}
                    activePlan={activePlan}
                    handleActivePlan={(plan) => handleChangeTab(plan)}
                  />
                </div>
              </div>
              <div className="col-span-10 md:col-span-8">
                <PlanYourCourseRight
                  handleSubmit={handleSubmit}
                  watch={watch}
                  errors={errors}
                  setValue={setValue}
                  idDetail={router.query.id as string}
                  control={control}
                  activePlan={activePlan}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <ModalSubmitError ref={refModalSubmitError} />
    </div>
  );
};
export default PlanYourCourse;

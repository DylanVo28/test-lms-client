import { Avatar, Button, Tab, Tabs } from '@nextui-org/react';
import Text from '../UI/Text';
import ListSection from './ListSection';
import { X } from '@phosphor-icons/react';
import VideoSection from './VideoSection';
import IconSearch from '../UI/Icons/IconSearch';
import Overview from './Overview';
import QA from './QA';
import Notes from './Notes';
import Announcements from './Announcements';
import Reviews from './Reviews';
import LearningTools from './LearningTools';
import Search from './Search';
import { useRouter } from 'next/router';
import { useGetDetailCourse, useGetListSession } from '../CreateCourse/service';
import { useEffect, useMemo, useRef, useState } from 'react';
import LoadingScreen from '../UI/LoadingScreen';
import { LessonContentType, TYPE_COURSE } from '@/utils/const';
import {
  useGetLessons,
  useGetQuizz,
  useProgressStatusLesson,
  useProgressStatusQuizz,
} from './service';
import FormQuizz from './FormQuizz';
import Article from './Article';
import LoadingContainer from '../UI/LoadingContainer';
import { UserCourseProgressStatus } from '@/utils/common';
import { toast } from '../UI/Toast/toast';
import { useProfile } from '@/store/profile/useProfile';
import { atom, useAtom } from 'jotai';
import { activeItemSectionAtom } from './ListSection/ChildSection';
import FormEndCourse from './FormEndCourse';
import { useClaimCertificates } from '@/layout/LessonLayout/service';
import NoDataContent from './NoDataContent';
import ModalClaimCertifications from '../UI/ModalClaimCertifications';
import {
  useGetListReview,
  useGetListReviewSummary,
} from '../Course/ListCourse/service';
import { useTranslation } from 'next-i18next';

export const valueProgressAtom = atom<any>({});
export const reviewedAtom = atom<boolean>(false);

const Lesson = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [typeLoadContent, setTypeLoadContent] = useState<string>('');
  const [startTakingTest, setStartTakingTest] = useState(false);
  const [endCourse, setEndCourse] = useState(false);

  const refModalClaimCertifications: any = useRef<any>(null);

  const { profile } = useProfile();
  const [, setActiveItemSection] = useAtom(activeItemSectionAtom);
  const [valueYourProgress, setValueYourProgress] = useAtom(valueProgressAtom);
  const [reviewed, setReviewed] = useAtom(reviewedAtom);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loadingNoData, setLoadingNoData] = useState(false);

  const {
    run: runGetListSession,
    data: dataListSession,
    loading: loadingListSession,
  } = useGetListSession({
    onSuccess: (res) => {
      const firstSection = res?.data?.[0];

      const newLessons = firstSection?.lessons?.map((lesson: any) => {
        return {
          ...lesson,
          type: TYPE_COURSE.LECTURE,
        };
      });

      const newQuizzes = firstSection?.quizzes?.map((quizz: any) => {
        return {
          ...quizz,
          type: TYPE_COURSE.QUIZ,
        };
      });
      const combinedArray = [...newLessons, ...newQuizzes];

      const totalLessons = res?.data.reduce(
        (acc: any, section: any) => acc + section.lessons.length,
        0
      );
      const totalQuizzes = res?.data.reduce(
        (acc: any, section: any) => acc + section.quizzes.length,
        0
      );
      const completedLessons = res?.data.reduce(
        (acc: any, section: any) =>
          acc +
          section.lessons.filter(
            (lesson: any) =>
              lesson.progress && lesson.progress.status === 'COMPLETED'
          ).length,
        0
      );

      const completedQuizzes = res?.data.reduce(
        (acc: any, section: any) =>
          acc +
          section.quizzes.filter(
            (quiz: any) => quiz.progress && quiz.progress.status === 'COMPLETED'
          ).length,
        0
      );

      setValueYourProgress({
        total: totalLessons + totalQuizzes,
        value: completedLessons + completedQuizzes,
      });

      const firstId = combinedArray?.[0]?.id;

      if (isFirstLoad) {
        setActiveItemSection(firstId);
        setIsFirstLoad(false);

        if (combinedArray?.[0]?.type === TYPE_COURSE.LECTURE) {
          runGetLessons(firstId);
          setTypeLoadContent(TYPE_COURSE.LECTURE);
        } else {
          runGetQuizz(firstId);
          setTypeLoadContent(TYPE_COURSE.QUIZ);
        }
      }
    },
  });

  const {
    dataLesson,
    run: runGetLessons,
    loading: loadingLesson,
  } = useGetLessons({
    onSuccess: () => {
      handleScrollTop();
    },
  });
  const {
    dataQuizz,
    run: runGetQuizz,
    loading: loadingQuizz,
  } = useGetQuizz({
    onSuccess: () => {
      handleScrollTop();
    },
  });
  const { run: getDetailCourse, data: dataDetail } = useGetDetailCourse({
    onSuccess: (res) => {
      console.log(res, 'res234');
      setReviewed(res?.data?.reviewed);
    },
  });

  const { dataListReviewSummary, run: runGetListReviewSummary } =
    useGetListReviewSummary();
  const {
    dataListReview,
    run: runGetListReview,
    mutate,
    onChange,
    loading,
  } = useGetListReview();

  const handleGetReviews = () => {
    runGetListReview(router.query.id as string);
    runGetListReviewSummary(router.query.id as string);
  };

  useEffect(() => {
    if (router.query.id) {
      handleGetReviews();
    }
  }, [router.query.id]);

  const itemsTab = [
    // {
    //   key: '1',
    //   icon: <IconSearch />,
    //   children: <Search />,
    // },
    {
      key: '2',
      label: t('Overview'),
      children: (
        <Overview
          dataDetail={dataDetail}
          dataListSection={dataListSession?.data}
        />
      ),
    },
    // {
    //   key: '3',
    //   label: 'Q&A',
    //   children: <QA />,
    // },
    // {
    //   key: '4',
    //   label: 'Notes',
    //   children: <Notes />,
    // },
    // {
    //   key: '5',
    //   label: 'Announcements',
    //   children: <Announcements />,
    // },
    {
      key: '6',
      label: t('Reviews'),
      children: (
        <Reviews
          dataListReviewSummary={dataListReviewSummary}
          loading={loading}
          onChange={onChange}
          mutate={mutate}
          dataListReview={dataListReview}
          courseId={router.query.id as string}
        />
      ),
    },
    // {
    //   key: '7',
    //   label: 'Learning tools',
    //   children: <LearningTools />,
    // },
  ];
  useEffect(() => {
    if (router.query.id) {
      getDetailCourse(router.query.id as string, profile?.id);
    }
  }, [router.query.id, profile?.id]);

  const { run: runClaimCertificates } = useClaimCertificates({
    onSuccess(res) {
      if (res?.data?.certificateId) {
        getDetailCourse(router.query.id as string, profile?.id);
        refModalClaimCertifications.current.onOpen(res?.data);
      }
    },
    onError(e) {
      // toast.error(e.message);
    },
  });

  const isLargestSeventyPercentProcess = useMemo(() => {
    return (valueYourProgress.value / valueYourProgress.total) * 100 >= 70;
  }, [valueYourProgress?.value]);
  console.log('isLargestSeventyPercentProcess', isLargestSeventyPercentProcess);
  useEffect(() => {
    const isEightyPercent =
      (valueYourProgress.value / valueYourProgress.total) * 100 >= 80;

    if (!dataDetail?.data?.receivedCertificate && isEightyPercent) {
      const body = {
        courseId: router.query.id as string,
      };
      runClaimCertificates(body);
    }
  }, [valueYourProgress?.value, dataDetail?.data?.receivedCertificate]);

  const onChangeCheckBox = (values: any) => {
    if (values?.progress?.status !== UserCourseProgressStatus?.COMPLETED) {
      if (values?.type === TYPE_COURSE.QUIZ) {
        const body = {
          status: UserCourseProgressStatus.COMPLETED,
        };
        requestProgressStatusQuizz.run(body, values?.id);
      } else {
        const body = {
          status: UserCourseProgressStatus.COMPLETED,
        };
        requestProgressStatusLesson.run(body, values?.id);
      }
    } else {
      if (values?.type === TYPE_COURSE.QUIZ) {
        const body = {
          status: UserCourseProgressStatus.PROGRESS,
        };
        requestProgressStatusQuizz.run(body, values?.id);
      } else {
        const body = {
          status: UserCourseProgressStatus.PROGRESS,
        };
        requestProgressStatusLesson.run(body, values?.id);
      }
    }
  };

  const requestProgressStatusLesson = useProgressStatusLesson({
    onSuccess: (res: any) => {
      // toast.success(res?.message);
      runGetListSession(router.query.id as string, profile?.id);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const requestProgressStatusQuizz = useProgressStatusQuizz({
    onSuccess: (res: any) => {
      // toast.success(res?.message);

      runGetListSession(router.query.id as string, profile?.id);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (router.query.id && profile?.id) {
      runGetListSession(router.query.id as string, profile?.id);
    }
  }, [router.query.id, profile?.id]);

  const handleScrollTop = () => {
    const element: any = document.querySelector('#topLesson');

    if (element) {
      element.style.scrollMarginTop = '120px';

      element.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        element.style.scrollMarginTop = '0';
      }, 1000);
    }
  };

  const handleClickChildLesson = (
    id: string,
    type: TYPE_COURSE,
    status?: UserCourseProgressStatus
  ) => {
    setTypeLoadContent(type);
    if (!type) {
      setLoadingNoData(true);
      setTimeout(() => {
        setLoadingNoData(false);
      }, 1000);
    }
    if (type === TYPE_COURSE.LECTURE && id) {
      runGetLessons(id);
    } else {
      setStartTakingTest(false);
      runGetQuizz(id);
    }
  };
  const handleSkipQuizz = (id: string) => {
    const body = {
      status: UserCourseProgressStatus.COMPLETED,
    };
    requestProgressStatusQuizz.run(body, id);

    const newSession = dataListSession?.data;
    const allItems = newSession.reduce((result: any, section: any) => {
      const newLessons = section?.lessons?.map((lesson: any) => {
        return {
          ...lesson,
          type: TYPE_COURSE.LECTURE,
        };
      });

      const newQuizzes = section?.quizzes?.map((quizz: any) => {
        return {
          ...quizz,
          type: TYPE_COURSE.QUIZ,
        };
      });
      return result.concat(newLessons, newQuizzes);
    }, []);
    const currentIndex = allItems?.findIndex((item: any) => item?.id === id);

    if (currentIndex !== -1 && currentIndex + 1 < allItems?.length) {
      const nextItem = allItems?.[currentIndex + 1];
      console.log(nextItem, 'nextItem');

      handleClickChildLesson(nextItem?.id, nextItem?.type);

      // const newPath = `/lesson/${router.query.id}?idChildSection=${nextItem?.id}`;
      // router.push(newPath);
      setActiveItemSection(nextItem?.id);
    } else {
      setEndCourse(true);
      setTypeLoadContent('');
    }
  };

  const allItems = dataListSession?.data?.reduce(
    (result: any, section: any) => {
      const newLessons = section?.lessons?.map((lesson: any) => {
        return {
          ...lesson,
          type: TYPE_COURSE.LECTURE,
        };
      });

      const newQuizzes = section?.quizzes?.map((quizz: any) => {
        return {
          ...quizz,
          type: TYPE_COURSE.QUIZ,
        };
      });

      return result.concat(newLessons, newQuizzes);
    },
    []
  );

  const handleFindIdNextChildSection = (id: string) => {
    const currentIndex = allItems?.findIndex((item: any) => item?.id === id);

    if (currentIndex !== -1 && currentIndex + 1 < allItems?.length) {
      const nextItem = allItems?.[currentIndex + 1];
      return nextItem;
    }
  };

  const handleFindIdPrevChildSection = (id: string) => {
    const currentIndex = allItems?.findIndex((item: any) => item?.id === id);

    if (currentIndex !== -1 && currentIndex - 1 < allItems?.length) {
      const nextItem = allItems?.[currentIndex - 1];
      return nextItem;
    }
  };
  const handleClickContinueQuizz = (id: string) => {
    const body = {
      status: UserCourseProgressStatus.COMPLETED,
    };
    requestProgressStatusQuizz.run(body, id);
  };
  const handleProgressStatusQuizz = (id: string) => {
    const body = {
      status: UserCourseProgressStatus.COMPLETED,
    };
    requestProgressStatusQuizz.run(body, id);
  };

  const handleNextChildSection = (
    type: string,
    idNext: string,
    idCurrent: string,
    currentType: string,
    contentType?: string
  ) => {
    // const newPath = `/lesson/${router.query.id}?idChildSection=${idNext}`;
    // router.push(newPath);
    setActiveItemSection(idNext);
    setTypeLoadContent(type);

    if (currentType === TYPE_COURSE.LECTURE) {
      const body = {
        status: UserCourseProgressStatus.COMPLETED,
      };
      requestProgressStatusLesson.run(body, idCurrent);
    } else {
      const body = {
        status: UserCourseProgressStatus.COMPLETED,
      };
      requestProgressStatusQuizz.run(body, idCurrent);
    }

    if (type === TYPE_COURSE.LECTURE && idNext) {
      if (contentType === LessonContentType?.ARTICLE) {
        const body = {
          status: UserCourseProgressStatus.COMPLETED,
        };
        requestProgressStatusLesson.run(body, idNext);
      }
      runGetLessons(idNext);
    } else {
      runGetQuizz(idNext);
    }
  };
  const handlePrevChildSection = (
    type: string,
    idNext: string,
    idCurrent: string,
    currentType: string
  ) => {
    // const newPath = `/lesson/${router.query.id}?idChildSection=${idNext}`;
    // router.push(newPath);
    setActiveItemSection(idNext);
    setTypeLoadContent(type);

    if (type === TYPE_COURSE.LECTURE && idNext) {
      runGetLessons(idNext);
    } else {
      runGetQuizz(idNext);
    }
  };

  const handleNextLastSection = (id: string, type: string) => {
    if (type === TYPE_COURSE.LECTURE) {
      const body = {
        status: UserCourseProgressStatus.COMPLETED,
      };
      requestProgressStatusLesson.run(body, id);
    } else {
      const body = {
        status: UserCourseProgressStatus.COMPLETED,
      };
      requestProgressStatusQuizz.run(body, id);
    }
    setEndCourse(true);
    setTypeLoadContent('');
  };

  return (
    <div className="grid md:grid-cols-10 relative" id="topLesson">
      <div className="md:col-span-7 px-4 md:px-0 flex flex-col">
        {!dataLesson?.data?.contentType &&
          typeLoadContent !== TYPE_COURSE.QUIZ &&
          !endCourse && (
            <NoDataContent
              handleNextLastSection={handleNextLastSection}
              handleNextChildSection={handleNextChildSection}
              handlePrevChildSection={handlePrevChildSection}
              handleFindIdNextChildSection={handleFindIdNextChildSection}
              handleFindIdPrevChildSection={handleFindIdPrevChildSection}
              data={dataLesson?.data}
              allItems={allItems}
              loading={loadingNoData || loadingListSession}
            />
          )}
        {endCourse && !typeLoadContent && (
          <FormEndCourse
            handleGetReviews={handleGetReviews}
            courseId={router.query.id as string}
          />
        )}
        {typeLoadContent === TYPE_COURSE.QUIZ && (
          <FormQuizz
            handleStartTakingTheTest={() => setStartTakingTest(true)}
            startTakingTest={startTakingTest}
            handleProgressStatusQuizz={handleProgressStatusQuizz}
            handleClickContinueQuizz={handleClickContinueQuizz}
            loading={loadingQuizz || requestProgressStatusQuizz?.loading}
            handleSkipQuizz={handleSkipQuizz}
            dataQuizz={dataQuizz?.data}
            allItems={allItems}
            handleNextLastSection={handleNextLastSection}
            handleNextChildSection={handleNextChildSection}
            handlePrevChildSection={handlePrevChildSection}
            handleFindIdNextChildSection={handleFindIdNextChildSection}
            handleFindIdPrevChildSection={handleFindIdPrevChildSection}
          />
        )}
        {dataLesson?.data?.contentType === LessonContentType.VIDEO &&
          typeLoadContent === TYPE_COURSE.LECTURE && (
            <VideoSection
              handleNextLastSection={handleNextLastSection}
              handleFindIdNextChildSection={handleFindIdNextChildSection}
              handleFindIdPrevChildSection={handleFindIdPrevChildSection}
              data={dataLesson?.data}
              allItems={allItems}
              handleNextChildSection={handleNextChildSection}
              handlePrevChildSection={handlePrevChildSection}
              loading={loadingLesson || loadingQuizz}
              info={dataLesson?.data?.info}
            />
          )}
        {dataLesson?.data?.contentType === LessonContentType.ARTICLE &&
          typeLoadContent === TYPE_COURSE.LECTURE && (
            <Article
              allItems={allItems}
              handleNextLastSection={handleNextLastSection}
              loading={loadingLesson || loadingQuizz}
              content={dataLesson?.data}
              handleFindIdNextChildSection={handleFindIdNextChildSection}
              handleFindIdPrevChildSection={handleFindIdPrevChildSection}
              handleNextChildSection={handleNextChildSection}
              handlePrevChildSection={handlePrevChildSection}
              data={dataLesson?.data}
            />
          )}

        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Options"
            defaultSelectedKey={'2'}
            classNames={{
              tabList:
                'gap-3 w-full relative rounded-none p-0 border-b border-white-10',
              cursor: 'w-full bg-[#129DDB]',
              tab: 'max-w-fit px-5 h-16 text-[16px] font-medium text-[#BFBFBF]',
              tabContent: 'group-data-[selected=true]:text-white',
            }}
            color="primary"
            variant="underlined"
          >
            {itemsTab?.map((item) => {
              return (
                <Tab key={item?.key} className="py-6" title={item?.label}>
                  {item?.children && item?.children}
                </Tab>
              );
            })}
          </Tabs>
        </div>
      </div>
      <div className="md:col-span-3 px-4 md:px-0">
        <div className="w-full sticky top-0 right-0 z-[10] h-full bg-[#0F141A]">
          <div className="flex justify-between py-6 px-4 items-center border-l-1 border-b-1 border-b-black-9 border-l-black-9 sticky top-0 z-[1000] bg-gray">
            <div className="flex items-center gap-2">
              {/* <Avatar src="/images/avatar-user.png" className="w-12 h-12" /> */}
              <div className="flex flex-col gap-[2px]">
                <Text type="text-18-600" className="text-white">
                  {t('Course content')}
                </Text>
                {/* <Text type="font-14-400" className="text-white">
                  Set certificate expiration date
                </Text> */}
              </div>
            </div>
            <Button variant="light" size="sm" isIconOnly radius="full">
              <X color="#fff" />
            </Button>
          </div>
          <ListSection
            onChangeCheckBox={onChangeCheckBox}
            // activeIdChildSection={activeIdChildSection}
            loading={loadingListSession}
            handleClickChildLesson={handleClickChildLesson}
            sections={dataListSession?.data}
          />
        </div>
      </div>
      <ModalClaimCertifications ref={refModalClaimCertifications} />
    </div>
    // </LoadingScreen>
  );
};
export default Lesson;

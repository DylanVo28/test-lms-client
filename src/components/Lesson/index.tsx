import { useClaimCertificates } from '@/layout/LessonLayout/service';
import { useProfile } from '@/store/profile/useProfile';
import { UserCourseProgressStatus } from '@/utils/common';
import { LessonContentType, TYPE_COURSE } from '@/utils/const';
import { Button, Tab, Tabs } from '@nextui-org/react';
import X from '@/components/UI/Icons/X';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useGetListReview,
  useGetListReviewSummary,
} from '../Course/ListCourse/service';
import { useGetDetailCourse, useGetListSession } from '../CreateCourse/service';
import ModalClaimCertifications from '../UI/ModalClaimCertifications';
import Text from '../UI/Text';
import { toast } from '../UI/Toast/toast';
import { useTranslation } from 'next-i18next';
import Article from './Article';
import FormEndCourse from './FormEndCourse';
import FormQuizz from './FormQuizz';
import ListSection from './ListSection';
import { activeItemSectionAtom } from './ListSection/ChildSection';
import NoDataContent from './NoDataContent';
import Overview from './Overview';
import Reviews from './Reviews';
import {
  useGetLessons,
  useGetQuizz,
  useProgressStatusLesson,
  useProgressStatusQuizz,
} from './service';
import VideoSection from './VideoSection';
import classNames from 'classnames';
import Image from 'next/image';
import { useShouldVideoReviewModal } from '@/hooks/useShouldVideoReviewModal';

export const valueProgressAtom = atom<{ value: number; total: number }>({
  value: 0,
  total: 0,
});
export const reviewedAtom = atom<boolean>(false);
export const lastModalShowTimeAtom = atom<Record<string, number>>({});

const Lesson = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const courseId = router.query.id as string;
  const [typeLoadContent, setTypeLoadContent] = useState<string>('');
  const [startTakingTest, setStartTakingTest] = useState(false);
  const [endCourse, setEndCourse] = useState(false);

  const refModalClaimCertifications: any = useRef<any>(null);

  const { profile } = useProfile();
  const [, setActiveItemSection] = useAtom(activeItemSectionAtom);
  const [valueYourProgress, setValueYourProgress] = useAtom(valueProgressAtom);
  const [reviewed, setReviewed] = useAtom(reviewedAtom);

  const { isOpenReviewModal, handleCloseReviewModal } =
    useShouldVideoReviewModal({
      courseId,
      progressValue: valueYourProgress.value || 0,
      progressTotal: valueYourProgress.total || 0,
    });

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loadingNoData, setLoadingNoData] = useState(false);
  const [isHideSidebar, setIsHideSidebar] = useState(false);
  const fetchingListSessionRef = useRef(false);
  const [progressOverrides, setProgressOverrides] = useState<
    Record<string, UserCourseProgressStatus | undefined>
  >({});

  const setProgressOverride = useCallback(
    (id: string, status: UserCourseProgressStatus) => {
      if (!id) return;
      setProgressOverrides((prev) => ({ ...prev, [id]: status }));
    },
    []
  );

  const {
    run: runGetListSession,
    data: dataListSession,
    loading: loadingListSession,
  } = useGetListSession({
    onSuccess: (res) => {
      fetchingListSessionRef.current = false;
      // merge server progress, keep local optimistic COMPLETED
      setProgressOverrides((prev) => {
        const next = { ...prev };
        res?.data?.forEach((section: any) => {
          section?.lessons?.forEach((lesson: any) => {
            if (lesson?.progress?.status === UserCourseProgressStatus.COMPLETED) {
              next[lesson.id] = UserCourseProgressStatus.COMPLETED;
            } else if (next[lesson.id] === undefined) {
              next[lesson.id] = lesson?.progress?.status;
            }
          });
          section?.quizzes?.forEach((quiz: any) => {
            if (quiz?.progress?.status === UserCourseProgressStatus.COMPLETED) {
              next[quiz.id] = UserCourseProgressStatus.COMPLETED;
            } else if (next[quiz.id] === undefined) {
              next[quiz.id] = quiz?.progress?.status;
            }
          });
        });
        return next;
      });
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
    onError: () => {
      fetchingListSessionRef.current = false;
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
      label: t('lesson.overview.title'),
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
      label: t('lesson.reviews'),
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
      setProgressOverride(values?.id, UserCourseProgressStatus.COMPLETED);
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
      setProgressOverride(values?.id, UserCourseProgressStatus.PROGRESS);
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

  // Helper function to safely call runGetListSession without duplicates
  const safeRunGetListSession = useCallback(
    (courseId: string, userId: string) => {
      if (!fetchingListSessionRef.current && courseId && userId) {
        fetchingListSessionRef.current = true;
        runGetListSession(courseId, userId);
      }
    },
    [runGetListSession]
  );

  // Reset ref when courseId or profileId changes
  useEffect(() => {
    fetchingListSessionRef.current = false;
  }, [router.query.id, profile?.id]);

  // Recompute progress locally when overrides or sessions change (optimistic)
  useEffect(() => {
    if (!dataListSession?.data) return;
    const totalLessons = dataListSession.data.reduce(
      (acc: number, section: any) => acc + section.lessons.length,
      0
    );
    const totalQuizzes = dataListSession.data.reduce(
      (acc: number, section: any) => acc + section.quizzes.length,
      0
    );
    const completedLessons = dataListSession.data.reduce(
      (acc: number, section: any) =>
        acc +
        section.lessons.filter(
          (lesson: any) =>
            (progressOverrides[lesson.id] ?? lesson.progress?.status) ===
            UserCourseProgressStatus.COMPLETED
        ).length,
      0
    );
    const completedQuizzes = dataListSession.data.reduce(
      (acc: number, section: any) =>
        acc +
        section.quizzes.filter(
          (quiz: any) =>
            (progressOverrides[quiz.id] ?? quiz.progress?.status) ===
            UserCourseProgressStatus.COMPLETED
        ).length,
      0
    );
    setValueYourProgress({
      total: totalLessons + totalQuizzes,
      value: completedLessons + completedQuizzes,
    });
  }, [dataListSession?.data, progressOverrides]);

  const requestProgressStatusLesson = useProgressStatusLesson({
    onSuccess: (res: any) => {
      // toast.success(res?.message);
      if (router.query.id && profile?.id) {
        safeRunGetListSession(router.query.id as string, profile?.id);
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const requestProgressStatusQuizz = useProgressStatusQuizz({
    onSuccess: (res: any) => {
      // toast.success(res?.message);
      if (router.query.id && profile?.id) {
        safeRunGetListSession(router.query.id as string, profile?.id);
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (router.query.id && profile?.id && !fetchingListSessionRef.current) {
      fetchingListSessionRef.current = true;
      runGetListSession(router.query.id as string, profile?.id);
    }
  }, [router.query.id, profile?.id]);

  const handleScrollTop = () => {
    const element : any = document.querySelector('#topLesson');
    const elementArticleContent : any = document.querySelector('#article-content');
    const p= elementArticleContent.querySelector("#article-content-inner")
    if (p) {
      p.style.scrollMarginTop = '120px';
      p.scrollIntoView({ behavior: 'smooth' })
      element.style.scrollMarginTop = '150px';
      element.scrollIntoView({ behavior: 'smooth' });
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
    setProgressOverride(id, UserCourseProgressStatus.COMPLETED);
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
  setProgressOverride(id, UserCourseProgressStatus.COMPLETED);
    requestProgressStatusQuizz.run(body, id);
  };
  const handleProgressStatusQuizz = (id: string) => {
    const body = {
      status: UserCourseProgressStatus.COMPLETED,
    };
  setProgressOverride(id, UserCourseProgressStatus.COMPLETED);
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
    setProgressOverride(idCurrent, UserCourseProgressStatus.COMPLETED);
      requestProgressStatusLesson.run(body, idCurrent);
    } else {
      const body = {
        status: UserCourseProgressStatus.COMPLETED,
      };
    setProgressOverride(idCurrent, UserCourseProgressStatus.COMPLETED);
      requestProgressStatusQuizz.run(body, idCurrent);
    }

    if (type === TYPE_COURSE.LECTURE && idNext) {
      if (contentType === LessonContentType?.ARTICLE) {
        const body = {
          status: UserCourseProgressStatus.COMPLETED,
        };
      setProgressOverride(idNext, UserCourseProgressStatus.COMPLETED);
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
    setProgressOverride(id, UserCourseProgressStatus.COMPLETED);
      requestProgressStatusLesson.run(body, id);
    } else {
      const body = {
        status: UserCourseProgressStatus.COMPLETED,
      };
    setProgressOverride(id, UserCourseProgressStatus.COMPLETED);
      requestProgressStatusQuizz.run(body, id);
    }
    setEndCourse(true);
    setTypeLoadContent('');
  };

  const handleToggleSidebar = () => {
    setIsHideSidebar(!isHideSidebar);
  };

  return (
    <div
      className={classNames(
        'grid relative',
        isHideSidebar ? 'md:grid-cols-1' : 'md:grid-cols-10'
      )}
      id="topLesson"
    >
      <div
        className={classNames(
          'md:col-span-7 px-4 md:px-0 flex flex-col',
          isHideSidebar && 'col-span-1'
        )}
      >
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
              loading={
                loadingNoData ||
                // loadingListSession ||
                loadingLesson ||
                isFirstLoad
              }
            />
          )}
        <FormEndCourse
          handleGetReviews={handleGetReviews}
          courseId={courseId}
          visible={isOpenReviewModal}
          onVisible={handleCloseReviewModal}
        />
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
              tabContent: 'group-data-[selected=true]:text-letter',
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
      {!isHideSidebar && (
        <div className="md:col-span-3 px-4 md:px-0 sticky top-0 h-screen">
          <div className="w-full bg-[#0F141A] h-full">
            <div className="flex justify-between py-6 px-4 items-center border-l-1 border-b-1 border-b-black-9 border-l-black-9  bg-gray">
              <div className="flex items-center gap-2">
                {/* <Avatar src="/images/avatar-user.png" className="w-12 h-12" /> */}
                <div className="flex flex-col gap-[2px]">
                  <Text type="text-18-600" className="text-letter">
                    {t('lesson.courseContent')}
                  </Text>
                  {/* <Text type="font-14-400" className="text-letter">
                  Set certificate expiration date
                </Text> */}
                </div>
              </div>
              <Button
                variant="light"
                size="sm"
                isIconOnly
                radius="full"
                onClick={handleToggleSidebar}
              >
                <X color="#fff" />
              </Button>
            </div>
            <ListSection
              onChangeCheckBox={onChangeCheckBox}
              // activeIdChildSection={activeIdChildSection}
              loading={loadingListSession}
              handleClickChildLesson={handleClickChildLesson}
              sections={dataListSession?.data}
              progressOverrides={progressOverrides}
            />
          </div>
        </div>
      )}

      {isHideSidebar && (
        <div
          className="absolute top-[25px] right-0 w-[40px] h-[30px] bg-main rounded-l-lg cursor-pointer flex items-center justify-center"
          onClick={handleToggleSidebar}
        >
          <div className="rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
          >
            <path
              d="M11.3332 11.6667V15.8333L19.6665 9.16667L11.3332 2.5V6.66667C6.73067 6.66667 2.99984 10.3975 2.99984 15C2.99984 15.2275 3.00817 15.4525 3.0265 15.675C3.66284 14.4651 4.61777 13.4522 5.78807 12.7458C6.95836 12.0393 8.2995 11.6661 9.6665 11.6667H11.3332Z"
              fill="var(--theme-letter)"
            />
          </svg>
          </div>
        </div>
      )}

      <ModalClaimCertifications ref={refModalClaimCertifications} />
    </div>
    // </LoadingScreen>
  );
};
export default Lesson;

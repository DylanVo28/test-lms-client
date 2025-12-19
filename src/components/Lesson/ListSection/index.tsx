import { useMemo } from 'react';
import AccordionCustom from '@/components/UI/AccordionCustom';
import Text from '@/components/UI/Text';
import LoadingContainer from '@/components/UI/LoadingContainer';
import { TYPE_COURSE } from '@/utils/const';
import {
  formatTimeDuration,
  UserCourseProgressStatus,
} from '@/utils/common';
import ChildSection from './ChildSection';

// Constants
const ZERO_DURATION = '00:00';
const HEADER_HEIGHT = 71; // px

// Types
interface LessonInfo {
  duration?: number;
}

interface Progress {
  status: UserCourseProgressStatus;
}

interface BaseItem {
  id: string;
  title: string;
  progress?: Progress;
}

interface Lesson extends BaseItem {
  contentType: string;
  info: LessonInfo;
}

interface Quiz extends BaseItem {}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  quizzes: Quiz[];
}

interface ProcessedItem extends BaseItem {
  type: TYPE_COURSE;
  sttLesson?: number;
  sttQuizz?: number;
  contentType?: string;
  info?: LessonInfo;
}

interface ListSectionProps {
  sections: Section[];
  loading: boolean;
  handleClickChildLesson: (
    id: string,
    type: TYPE_COURSE,
    status: UserCourseProgressStatus
  ) => void;
  onChangeCheckBox: (values: any) => void;
  progressOverrides?: Record<string, UserCourseProgressStatus | undefined>;
}

// Helper function
const calculateTotalDuration = (lessons: Lesson[]): string => {
  const totalSeconds = lessons
    .filter((item) => item.contentType === 'VIDEO')
    .reduce((sum, item) => sum + (item.info?.duration || 0), 0);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

const ListSection = ({
  sections,
  handleClickChildLesson,
  onChangeCheckBox,
  loading,
  progressOverrides = {},
}: ListSectionProps) => {
  const processedSections = useMemo(() => {
    if (!sections || sections.length === 0) return [];

    return sections.map((section) => {
      const lessons = section.lessons || [];
      const quizzes = section.quizzes || [];

      const processedLessons: ProcessedItem[] = lessons.map((lesson, index) => ({
        ...lesson,
        type: TYPE_COURSE.LECTURE,
        sttLesson: index + 1,
        progress: {
          status:
            (progressOverrides[lesson.id] as UserCourseProgressStatus) ??
            lesson.progress?.status ??
            UserCourseProgressStatus.PROGRESS,
        },
      }));

      const processedQuizzes: ProcessedItem[] = quizzes.map((quiz, index) => ({
        ...quiz,
        type: TYPE_COURSE.QUIZ,
        sttQuizz: index + 1,
        progress: {
          status:
            (progressOverrides[quiz.id] as UserCourseProgressStatus) ??
            quiz.progress?.status ??
            UserCourseProgressStatus.PROGRESS,
        },
      }));

      const childSections = [...processedLessons, ...processedQuizzes];
      
      const completedCount = childSections.filter(
        (item) => item.progress?.status === UserCourseProgressStatus.COMPLETED
      ).length;

      const totalDuration = calculateTotalDuration(lessons);

      return {
        ...section,
        childSections,
        totalCount: lessons.length + quizzes.length,
        completedCount,
        totalDuration,
      };
    });
  }, [sections, progressOverrides]);

  return (
    <div 
      className="flex flex-col bg-black-70 overflow-y-auto overflow-x-hidden gap-4 h-full border-l-1 border-l-[#D9D9D91A] relative scroll-custom"
      style={{ maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      <LoadingContainer loading={loading} />

      <div className="mx-[-8px]">
        {processedSections.map((section, index) => (
          <AccordionCustom
            key={section.id}
            isSection
            title={
              <div className="flex flex-col gap-2">
                <Text type="font-16-600" className="text-letter">
                  {`Section ${index + 1}: ${section.title}`}
                </Text>
                <div className="flex items-center gap-3">
                  <Text type="font-14-400" className="opacity-50">
                    {`${section.completedCount}/${section.totalCount}`}
                  </Text>
                  {section.totalDuration !== ZERO_DURATION && (
                    <Text type="font-14-400" className="opacity-50">
                      {formatTimeDuration(section.totalDuration)}
                    </Text>
                  )}
                </div>
              </div>
            }
          >
            {section.childSections.length > 0 && (
              <ChildSection
                onChangeCheckBox={onChangeCheckBox}
                handleClickChildLesson={handleClickChildLesson}
                items={section.childSections}
                progressOverrides={progressOverrides}
              />
            )}
          </AccordionCustom>
        ))}
      </div>
    </div>
  );
};

export default ListSection;
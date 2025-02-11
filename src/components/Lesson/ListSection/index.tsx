import AccordionCustom from '@/components/UI/AccordionCustom';
import Text from '@/components/UI/Text';
import { TYPE_COURSE } from '@/utils/const';
import { useMemo } from 'react';
import ChildSection from './ChildSection';
import LoadingContainer from '@/components/UI/LoadingContainer';
import {
  formatTimeDuration,
  generateRandomId,
  UserCourseProgressStatus,
} from '@/utils/common';

const ListSection = ({
  sections,
  handleClickChildLesson,
  onChangeCheckBox,
  loading,
}: // activeIdChildSection,
{
  handleClickChildLesson: (
    id: string,
    type: TYPE_COURSE,
    status: UserCourseProgressStatus
  ) => void;
  onChangeCheckBox: (values: any) => void;
  sections: any;
  loading: boolean;
  // activeIdChildSection: any
}) => {
  // const processSectionsData = useMemo(() => {
  //   const newData = sections?.map((section: any, index: any) => {
  //     // Check if current section is the last element
  //     if (index === sections?.length - 1) {
  //       return {
  //         ...section,
  //         endCourse: [
  //           {
  //             id: generateRandomId(),
  //             type: TYPE_COURSE?.END_COURSE,
  //           },
  //         ],
  //       };
  //     }
  //     return section;
  //   });

  //   return newData;
  // }, [sections]);

  return (
    <div className="flex flex-col bg-[#0F141A] overflow-auto overflow-x-hidden gap-4 h-full border-l-1 border-l-[#D9D9D91A] relative">
      <LoadingContainer loading={loading} />

      <div className="mx-[-8px]">
        {sections?.map((item: any, index: number) => {
          const countChildrendSection =
            item?.quizzes?.length + item?.lessons?.length;

          const newLessons = item?.lessons?.map(
            (lesson: any, indexLesson: number) => {
              return {
                ...lesson,
                type: TYPE_COURSE.LECTURE,
                sttLesson: indexLesson + 1,
              };
            }
          );

          const newQuizzes = item?.quizzes?.map(
            (quizz: any, indexQuizz: number) => {
              return {
                ...quizz,
                type: TYPE_COURSE.QUIZ,
                sttQuizz: indexQuizz + 1,
              };
            }
          );
          const listChildSection = newLessons?.concat(newQuizzes);
          const newDataChilSectionSort = listChildSection?.sort(
            (a: any, b: any) => a.ordinalNumber - b.ordinalNumber
          );

          const completedCount = listChildSection?.filter(
            (item: any) =>
              item?.progress &&
              item?.progress?.status === UserCourseProgressStatus.COMPLETED
          ).length;

          const totalDuration = newLessons
            .filter((item: any) => item.contentType === 'VIDEO')
            .reduce(
              (sum: any, item: any) => sum + (item.info.duration || 0),
              0
            );

          const minutes = Math.floor(totalDuration / 60);
          const seconds = Math.floor(totalDuration % 60);
          const formattedTime = `${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

          return (
            <AccordionCustom
              key={item?.id}
              isSection
              title={
                <div className="flex flex-col gap-2">
                  <Text type="font-16-600" className="text-white">
                    {`Section ${index + 1}: ${item?.title}`}
                  </Text>
                  <div className="flex items-center gap-3">
                    <Text type="font-14-400" className="opacity-50">
                      {`${completedCount}/${countChildrendSection}`}
                    </Text>
                    <Text type="font-14-400" className="opacity-50">
                      {formatTimeDuration(formattedTime)}
                    </Text>
                  </div>
                </div>
              }
            >
              {newDataChilSectionSort?.length > 0 ? (
                <ChildSection
                  onChangeCheckBox={onChangeCheckBox}
                  // activeIdChildSection={activeIdChildSection}
                  handleClickChildLesson={handleClickChildLesson}
                  items={listChildSection}
                />
              ) : (
                <></>
              )}
            </AccordionCustom>
          );
        })}
      </div>
    </div>
  );
};
export default ListSection;

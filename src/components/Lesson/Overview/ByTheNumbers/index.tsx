import Text from '@/components/UI/Text';
import { formatTimeDuration } from '@/utils/common';
import { useMemo } from 'react';
import { isMobile } from 'react-device-detect';

const ByTheNumbers = ({ course }: { course: any }) => {
  console.log(course, 'course');

  const lessonCount = course?.sections?.reduce(
    (total: number, section: any) => {
      return (
        total + (section.lessons?.length || 0) + (section.quizzes?.length || 0)
      );
    },
    0
  );
  const formattedTime: string = useMemo(() => {
    const totalDuration = course?.sections?.reduce(
      (total: any, section: any) => {
        const videoLessons = section?.lessons?.filter(
          (lesson: any) => lesson?.contentType === 'VIDEO'
        );
        const durationSum = videoLessons?.reduce(
          (sum: any, lesson: any) => sum + (lesson?.info?.duration || 0),
          0
        );
        return total + durationSum;
      },
      0
    );

    const minutes = Math.floor(totalDuration / 60);
    const seconds = Math.floor(totalDuration % 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

    return formattedTime;
  }, [course?.sections]);
  return (
    <div className="py-6 grid grid-cols-1 gap-5 lg:gap-0 lg:grid-cols-3 border-b border-b-[#1F1F1F] pb-9">
      <Text type="font-18-600" className="text-white">
        {'By the numbers'}
      </Text>
      {isMobile ? (
        <div className="flex gap-8">
          <div className="flex flex-col gap-1">
            <Text type="font-14-400" className="text-white">
              {'Skill level'}: {course?.level}
            </Text>
            <Text type="font-14-400" className="text-white">
              {'Students'}:{' '}
              {course?.userCourses?.length || course?.countStudents}
            </Text>
            <Text type="font-14-400" className="text-white">
              {'Languages'}: {course?.lang}
            </Text>
            <Text type="font-14-400" className="text-white">
              {'Captions'}: {'Yes'}
            </Text>
          </div>
          <div className="flex flex-col gap-1">
            <Text type="font-14-400" className="text-white">
              {'Lectures'}: {lessonCount || 0}
            </Text>
            <Text type="font-14-400" className="text-white">
              {`${'Video'}: ${formatTimeDuration(formattedTime)}`}
            </Text>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <Text type="font-14-400" className="text-white">
              {'Skill level'}: {course?.level}
            </Text>
            <Text type="font-14-400" className="text-white">
              {'Students'}:{' '}
              {course?.userCourses?.length || course?.countStudents}
            </Text>
            <Text type="font-14-400" className="text-white">
              {'Languages'}: {course?.lang}
            </Text>
            <Text type="font-14-400" className="text-white">
              {'Captions'}: {'Yes'}
            </Text>
          </div>
          <div className="flex flex-col gap-1">
            <Text type="font-14-400" className="text-white">
              {'Lectures'}: {lessonCount || 0}
            </Text>
            <Text type="font-14-400" className="text-white">
              {`${'Video'}: ${formatTimeDuration(formattedTime)}`}
            </Text>
          </div>
        </>
      )}
    </div>
  );
};
export default ByTheNumbers;

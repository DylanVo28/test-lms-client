import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import { Check } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const DATA_CONTENT = [
  {
    id: 1,
    content: 'Intended learners',
  },
  {
    id: 2,
    content: 'Curriculum',
  },
  {
    id: 3,
    content: 'Course landing page',
  },
  {
    id: 4,
    content: 'Set Price',
  },
  // {
  //   id: 4,
  //   content: 'Referral',
  // },
];

const PlanYourCourseLeft = ({
  activePlan,
  handleActivePlan,
  dataDetail,
}: {
  handleActivePlan: (plan: number) => void;
  activePlan: number;
  dataDetail: any;
}) => {
  const isEnoughtSetPrice =
    dataDetail?.data?.price &&
    dataDetail?.data?.originPrice &&
    dataDetail?.data?.promotionPeriod;
  const isEnoughIntendedLearners =
    dataDetail?.data?.objectives?.length > 0 &&
    dataDetail?.data?.intenedLeaners?.length > 0 &&
    dataDetail?.data?.requirements?.length > 0;

  const isEnoughCourseLangdingePage =
    dataDetail?.data?.title &&
    dataDetail?.data?.subtitle &&
    dataDetail?.data?.lang &&
    dataDetail?.data?.level &&
    dataDetail?.data?.categoryId &&
    dataDetail?.data?.subCategoryId &&
    dataDetail?.data?.topics?.length > 0 &&
    dataDetail?.data?.image &&
    dataDetail?.data?.video &&
    dataDetail?.data?.description;

  const isEnoughCurruclum = dataDetail?.data?.sections?.some(
    (item: any) =>
      (item.lessons && item.lessons.length > 0) ||
      (item.quizzes && item.quizzes.length > 0)
  );

  return (
    <div className="flex flex-col gap-4">
      {DATA_CONTENT?.map((item) => {
        return (
          <div
            onClick={() => handleActivePlan(item?.id)}
            className={clsx(
              'flex items-center cursor-pointer border-l-4 transition-all  border-l-transparent gap-3 p-2',
              {
                ['!border-l-4 !border-l-main bgActivePlan']:
                  item?.id === activePlan,
              }
            )}
          >
            <div className="w-6 h-6 flex justify-center rounded-full items-center  border-1 border-black-7">
              {item?.id === 1 && isEnoughIntendedLearners && (
                <Check className="text-main" size={14} weight="bold" />
              )}
              {item?.id === 2 && isEnoughCurruclum && (
                <Check className="text-main" size={14} weight="bold" />
              )}

              {item?.id === 3 && isEnoughCourseLangdingePage && (
                <Check className="text-main" size={14} weight="bold" />
              )}
              {item?.id === 4 && isEnoughtSetPrice && (
                <Check className="text-main" size={14} weight="bold" />
              )}
            </div>

            <Text type="font-16-500" className="text-white">
              {item?.content}
            </Text>
          </div>
        );
      })}
    </div>
  );
};
export default PlanYourCourseLeft;

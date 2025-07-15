import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import { Check } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
const PlanYourCourseLeft = ({
  activePlan,
  handleActivePlan,
  isEnoughtSetPrice,
  isEnoughCourseLangdingePage,
  isEnoughCurruclum,
  isEnoughIntendedLearners,
}: {
  handleActivePlan: (plan: number) => void;
  activePlan: number;
  isEnoughtSetPrice: any;
  isEnoughCourseLangdingePage: any;
  isEnoughCurruclum: any;
  isEnoughIntendedLearners: any;
}) => {
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

  return (
    <div className="flex flex-col gap-4">
      {DATA_CONTENT?.map((item) => {
        return (
          <div
            key={item.id}
            onClick={() => handleActivePlan(item?.id)}
            className={clsx(
              'flex items-center cursor-pointer border-l-4 transition-all border-l-transparent gap-3 p-2',
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

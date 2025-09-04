import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import Check from '@/components/UI/Icons/Check';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('common');
  const DATA_CONTENT = [
    {
      id: 1,
      content: t('createCourse.planCourse.menu.intendedLearners'),
    },
    {
      id: 2,
      content: t('createCourse.planCourse.menu.curriculum'),
    },
    {
      id: 3,
      content: t('createCourse.planCourse.menu.courseLandingPage'),
    },
    {
      id: 4,
      content: t('createCourse.planCourse.menu.setPrice'),
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
                <Check className="text-main" />
              )}
              {item?.id === 2 && isEnoughCurruclum && (
                <Check className="text-main" />
              )}

              {item?.id === 3 && isEnoughCourseLangdingePage && (
                <Check className="text-main" />
              )}
              {item?.id === 4 && isEnoughtSetPrice && (
                <Check className="text-main" />
              )}
            </div>

            <Text type="font-16-500" className="text-letter">
              {item?.content}
            </Text>
          </div>
        );
      })}
    </div>
  );
};
export default PlanYourCourseLeft;

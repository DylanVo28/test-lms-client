import Text from '@/components/UI/Text';
import { useTranslation } from 'next-i18next';

const DATA_LEARN = [
  {
    id: 1,
    text: 'Prepare for Industry Certification Exam',
  },
  {
    id: 2,
    text: 'Earn Certification that is Proof of your Competence',
  },
  {
    id: 3,
    text: 'Hours and Hours of Video Instruction',
  },
  {
    id: 4,
    text: 'Dozens of Code Examples to Download and Study',
  },
  {
    id: 5,
    text: 'Over 25 Engaging Lab Exercises',
  },
  {
    id: 6,
    text: 'All Lab Solutions',
  },
  {
    id: 7,
    text: 'Instructor Available by Email or on the Forums',
  },
  {
    id: 8,
    text: 'All Free Tools',
  },
  {
    id: 9,
    text: 'Comprehensive Coverage of HTML and CSS',
  },
  {
    id: 10,
    text: 'Client Side Programming with Javascript',
  },
];

const YouLearn = ({ data }: { data: any }) => {
  const { t } = useTranslation('common');

  return (
    <>
      <div className="flex flex-col gap-6 border-b-1 border-b-black-10 pb-10">
        <Text className="text-white" type="font-20-600">
          {t("What you'll learn")}
        </Text>
        <div className="grid grid-cols-2 gap-4">
          {data?.objectives?.map((item: any) => {
            return (
              <div key={item?.id} className="py-4 flex items-center gap-4">
                <div className="w-6 h-6">
                  <IconCheck />
                </div>
                <Text type="font-14-400" className="text-white">
                  {item}
                </Text>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-6 border-b-1 border-b-black-10 pb-10">
        <Text className="text-white" type="font-20-600">
          {t(
            'What are the requirements or prerequisites for taking your course?'
          )}
        </Text>
        <div className="grid grid-cols-2 gap-4">
          {data?.requirements?.map((item: any) => {
            return (
              <div key={item?.id} className="py-4 flex items-center gap-4">
                <div className="w-6 h-6">
                  <IconCheck />
                </div>
                <Text type="font-14-400" className="text-white">
                  {item}
                </Text>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-6 border-b-1 border-b-black-10 pb-10">
        <Text className="text-white" type="font-20-600">
          {t('Who is this course for?')}
        </Text>
        <div className="grid grid-cols-2 gap-4">
          {data?.intenedLeaners?.map((item: any) => {
            return (
              <div key={item?.id} className="py-4 flex items-center gap-4">
                <div className="w-6 h-6">
                  <IconCheck />
                </div>
                <Text type="font-14-400" className="text-white">
                  {item}
                </Text>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default YouLearn;

const IconCheck = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M8.33333 12.6433L15.9933 4.98242L17.1725 6.16076L8.33333 14.9999L3.03 9.69659L4.20833 8.51826L8.33333 12.6433Z"
        fill="#1DB78D"
      />
    </svg>
  );
};

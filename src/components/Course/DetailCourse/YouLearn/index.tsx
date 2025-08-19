import Text from '@/components/UI/Text';
import { useTranslation } from 'next-i18next';
const YouLearn = ({ data }: { data: any }) => {
  const { t } = useTranslation('common');
  return (
    <>
      <div className="flex flex-col gap-3 border-b-1 border-b-black-10 pb-5">
        <Text className="text-letter" type="font-20-600">
          {t('course.whatYouLearn')}
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
          {data?.objectives?.map((item: any) => {
            return (
              <div key={item?.id} className="py-2 flex items-center gap-4">
                <div className="w-6 h-6">
                  <IconCheck />
                </div>
                <Text type="font-14-400" className="text-letter">
                  {item}
                </Text>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3 border-b-1 border-b-black-10 pb-5">
        <Text className="text-letter" type="font-20-600">
          {t('course.prerequisitesQuestion')}
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
          {data?.requirements?.map((item: any) => {
            return (
              <div key={item?.id} className="py-2 flex items-center gap-4">
                <div className="w-6 h-6">
                  <IconCheck />
                </div>
                <Text type="font-14-400" className="text-letter">
                  {item}
                </Text>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3 border-b-1 border-b-black-10 pb-5">
        <Text className="text-letter" type="font-20-600">
          {t('course.whoIsThisFor')}
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
          {data?.intenedLeaners?.map((item: any) => {
            return (
              <div key={item?.id} className="py-2 flex items-center gap-4">
                <div className="w-6 h-6">
                  <IconCheck />
                </div>
                <Text type="font-14-400" className="text-letter">
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

import Text from '@/components/UI/Text';
import { useTranslation } from 'next-i18next';

const DATA_REQUIREMENTS = [
  `There are no skill prerequisites for this course although it's helpful if you are familiar with operating your internet.`,
  `You can take this course using a Mac, PC or LInux machine.`,
  `It is recommended that you download the free Komodo text editor.`,
];

const Requirements = ({ data }: { data: any }) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col gap-6 border-b-1 border-b-black-10 pb-10">
      <Text className="text-white" type="font-20-600">
        {t('Requirements')}
      </Text>
      <div className="flex flex-col gap-1">
        {data?.requirements?.map((item: any) => {
          return (
            <div className="flex items-center py-2 gap-2">
              <div className="bg-white w-1.5 h-1.5 rounded-full" />
              <Text type="font-14-400" className="text-white">
                {item}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Requirements;

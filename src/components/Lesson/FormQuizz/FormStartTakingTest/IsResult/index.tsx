import Text from '@/components/UI/Text';
import { Tooltip } from '@nextui-org/react';
import Check from '@/components/UI/Icons/Check';
import Info from '@/components/UI/Icons/Info';
import Star from '@/components/UI/Icons/Star';
const IsResult = ({
  title,
  totalQuizz,
  questions,
}: {
  questions: any;
  title: string;
  totalQuizz: number;
}) => {
  return (
    <div className="flex flex-col h-full flex-1">
      <div className="bg-green-50 md:p-8 p-4 min-h-[140px] md:min-h-[240px]">
        <div className="flex flex-col justify-center  gap-3 md:w-6/12 mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-full bg-white h-[2px]" />
            <div className="min-w-14 min-h-14 flex justify-center rounded-full  items-center bg-text-letter">
              <Star size={32} className="!fill-green" />
            </div>
            <div className="w-full bg-white h-[2px]" />
          </div>

          <Text className="text-letter" type="font-24-700">
            {"Great! You're ready to move on to the next lecture."}
          </Text>
          <Text className="text-letter" type="font-16-400">
            {`You answered ${totalQuizz}/${totalQuizz} question correctly.`}
          </Text>
        </div>
      </div>
      <div className="flex-1 md:p-12 px-4 py-8 md:w-6/12 mx-auto h-full flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-4">
            <Check size={24} className="fill-green" />
            <Text className="text-letter" type="font-24-700">
              {'Things you need to know'}
            </Text>
            <Info size={20} />
          </div>

          {questions?.map((item: any, index: number) => {
            return (
              <div key={item?.id} className="flex items-center gap-1 pl-10">
                <Text className="text-letter/70" type="font-16-600">
                  {`${index + 1}.`}
                </Text>
                <div
                  dangerouslySetInnerHTML={{ __html: item?.question }}
                  className="text-xl font-semibold text-letter/70"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default IsResult;

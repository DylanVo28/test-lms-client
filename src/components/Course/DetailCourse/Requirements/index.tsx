import Text from '@/components/UI/Text';
const Requirements = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col gap-3 border-b-1 border-b-black-10 pb-5">
      <Text className="text-letter" type="font-20-600">
        {'Requirements'}
      </Text>
      <div className="flex flex-col gap-1">
        {data?.requirements?.map((item: any) => {
          return (
            <div className="flex items-center py-2 gap-2">
              <div className="bg-white w-1.5 h-1.5 rounded-full" />
              <Text type="font-14-400" className="text-letter">
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

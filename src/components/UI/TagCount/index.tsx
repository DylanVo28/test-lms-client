import Text from '../Text';

const TagCount = ({ count }: { count: number }) => {
  return (
    <div className="flex justify-center items-center bg-noti-red py-[2px] px-1 rounded-full w-5 h-5">
      <Text type="font-12-700" className="text-letter">
        {count}
      </Text>
    </div>
  );
};
export default TagCount;

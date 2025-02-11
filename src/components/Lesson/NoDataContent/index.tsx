import { IconNodata } from '@/components/ListCourse/NoData';
import LoadingContainer from '@/components/UI/LoadingContainer';
import Text from '@/components/UI/Text';

const NoDataContent = ({ loading }: { loading: boolean }) => {
  console.log(loading, 'loading');

  return (
    <div className="w-full relative min-h-[566px]  flex  justify-center pt-20 p-12 group">
      <LoadingContainer loading={loading} />

      <div className="flex flex-col gap-3 justify-center items-center text-center mt-10">
        <IconNodata />
        <Text type="font-12-400" className="text-neutral">
          {'No content'}
        </Text>
      </div>
    </div>
  );
};
export default NoDataContent;

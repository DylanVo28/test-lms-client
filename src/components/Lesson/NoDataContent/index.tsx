import { IconNodata } from '@/components/ListCourse/NoData';
import LoadingContainer from '@/components/UI/LoadingContainer';
import Text from '@/components/UI/Text';
import { TYPE_COURSE } from '@/utils/const';
import { Button } from '@nextui-org/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

const NoDataContent = ({
  handleNextChildSection,
  handlePrevChildSection,
  handleFindIdNextChildSection,
  handleFindIdPrevChildSection,
  handleNextLastSection,
  allItems,
  data,
  loading,
}: any) => {
  const dataItemNext = handleFindIdNextChildSection(data?.id);
  const dataItemPrev = handleFindIdPrevChildSection(data?.id);
  const lastIndex = allItems?.findIndex((item: any) => item?.id === data?.id);

  return (
    <div className="w-full relative min-h-[566px] flex justify-center pt-20 p-12 group">
      <LoadingContainer loading={loading} />
      {dataItemPrev?.id && (
        <Button
          className="absolute group-hover:opacity-100 opacity-0 left-0 bg-main border-1 border-white/50 min-h-[50px] z-[1000] top-1/2 -translate-y-1/2"
          isIconOnly
          onClick={() => {
            handlePrevChildSection(
              dataItemPrev?.type,
              dataItemPrev?.id,
              data?.id,
              TYPE_COURSE.LECTURE
            );
          }}
          size="sm"
          radius="sm"
        >
          <CaretLeft size={24} />
        </Button>
      )}

      <Button
        className="absolute right-0 group-hover:opacity-100 opacity-0 bg-main border-1 border-white/50 min-h-[50px] z-[1000] top-1/2 -translate-y-1/2"
        isIconOnly
        size="sm"
        onClick={() => {
          if (lastIndex === allItems?.length - 1) {
            handleNextLastSection();
          } else {
            handleNextChildSection(
              dataItemNext?.type,
              dataItemNext?.id,
              data?.id,
              TYPE_COURSE.LECTURE,
              dataItemNext?.contentType
            );
          }
        }}
        radius="sm"
      >
        <CaretRight size={24} />
      </Button>
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

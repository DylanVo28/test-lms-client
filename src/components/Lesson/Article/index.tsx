import Text from '@/components/UI/Text';
import { TYPE_COURSE } from '@/utils/const';
import { Button } from '@nextui-org/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

const Article = ({
  content,
  handleFindIdNextChildSection,
  handleFindIdPrevChildSection,
  handleNextChildSection,
  handlePrevChildSection,
  allItems,
  handleNextLastSection,
  data,
}: any) => {
  const dataItemNext = handleFindIdNextChildSection(data?.id);
  const dataItemPrev = handleFindIdPrevChildSection(data?.id);
  const lastIndex = allItems.findIndex((item: any) => item?.id === data?.id);

  return (
    <div className="w-full min-h-[566px] relative pt-20 p-12 group">
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
      <div className="flex flex-col gap-8 w-8/12 mx-auto">
        <Text type="font-32-700">{content?.title}</Text>
        <div
          className="text-2xl text-black-5"
          dangerouslySetInnerHTML={{
            __html: content?.content,
          }}
        />
      </div>
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
              TYPE_COURSE.LECTURE
            );
          }
        }}
        radius="sm"
      >
        <CaretRight size={24} />
      </Button>
    </div>
  );
};
export default Article;

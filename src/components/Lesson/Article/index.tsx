import Text from '@/components/UI/Text';
import { TYPE_COURSE } from '@/utils/const';
import { Button } from '@nextui-org/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerBounds, setContainerBounds] = useState<DOMRect | null>(null);
  const isFirstLesson = lastIndex === 0;
  const isLastLesson = lastIndex === allItems?.length - 1;

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        setContainerBounds(containerRef.current.getBoundingClientRect());
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, true);

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds, true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[400px] md:min-h-[566px] max-h-[566px] scroll-custom overflow-auto relative pt-10 md:pt-20 p-4 md:p-12 group break-all"
    >
      {/* {dataItemPrev?.id && (
        <Button
          className="absolute group-hover:opacity-100 opacity-0  left-0 bg-main border-1 border-white-50 min-h-[50px] z-[1000] top-1/2 -translate-y-1/2"
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
          <CaretLeft size={24} className="fill-text-letter" />
        </Button>
      )} */}
      {containerBounds && (
        <>
          {/* Left button */}
          {dataItemPrev?.id && !isFirstLesson && (
            <Button
              className="fixed bg-main border-1 border-white-50 min-h-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              style={{
                left: containerBounds.left,
                top: containerBounds.top + containerBounds.height / 2,
                transform: 'translateY(-50%)',
              }}
              isIconOnly
              onPress={() => {
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
              <CaretLeft size={24} className="fill-text-letter" />
            </Button>
          )}

          {/* Right button */}
          {!isLastLesson && (
            <Button
              className="fixed bg-main border-1 border-white-50 min-h-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              style={{
                right: window.innerWidth - containerBounds.right,
                top: containerBounds.top + containerBounds.height / 2,
                transform: 'translateY(-50%)',
              }}
              isIconOnly
              size="sm"
              onPress={() => {
                if (lastIndex === allItems?.length - 1) {
                  handleNextLastSection(data?.id, TYPE_COURSE.LECTURE);
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
              <CaretRight size={24} className="fill-text-letter" />
            </Button>
          )}
        </>
      )}
      <div className="flex flex-col gap-8 w-8/12 mx-auto">
        <Text type="font-28-700">{content?.title}</Text>
        <div
          className="text-2xl text-black-5 customContentEditor"
          dangerouslySetInnerHTML={{
            __html: content?.content,
          }}
        />
      </div>
      {/* <Button
        className="absolute right-0 group-hover:opacity-100 opacity-0  bg-main border-1 border-white-50 min-h-[50px] z-[1000] top-1/2 -translate-y-1/2"
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
        <CaretRight size={24} className="fill-text-letter" />
      </Button> */}
    </div>
  );
};
export default Article;

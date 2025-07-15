import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
const Description = ({ description }: { description: string }) => {
  return (
    <div className="py-6 grid grid-cols-1 gap-5 lg:gap-0 lg:grid-cols-3 border-b border-b-[#1F1F1F] pb-9">
      <div className="col-span-1">
        <Text type="font-18-600" className="text-white">
          {'Description'}
        </Text>
      </div>

      <div className="flex flex-col gap-3 col-span-2">
        <div
          className="text-white"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {/* <Button
          variant="light"
          radius="full"
          size="sm"
          className="hover:bg-main-20 w-max"
        >
          <div className="flex items-center gap-[2px]">
            <Text type="font-14-500" className="text-main">
              {'See More'}
            </Text>
            <Image
              src={'/icons/ic-arrow-drop-right-line.svg'}
              width={20}
              height={20}
              alt=""
            />
          </div>
        </Button> */}
      </div>
    </div>
  );
};
export default Description;

import IconDate from '@/components/UI/Icons/IconDate';
import IconTime from '@/components/UI/Icons/IconTime';
import RateStar from '@/components/UI/RateStar';
import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import { Button, Tooltip } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const CardCourse = ({ item }: { item?: any }) => {
  const router = useRouter();
  const lessonCount = item?.sections?.reduce((total: number, section: any) => {
    return total + (section.lessons?.length || 0);
  }, 0);
  return (
    <div
      onClick={() => router.push(ROUTE_PATH.DETAIL_COURSE(item?.id))}
      className="rounded transition-all cursor-pointer  duration-300 hover:opacity-80"
    >
      <Image
        src={item?.image || '/images/img-default.png'}
        width={302}
        height={200}
        alt=""
        className="w-full h-[200px] rounded rounded-b-none"
        layout="contain"
        onError={(e: any) => {
          e.target.srcset = '/images/img-default.png';
        }}
      />
      <div className="py-4 px-3 rounded bg-white/10 flex flex-col gap-[10px]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <IconDate />
            <Text type="font-12-500">{lessonCount} Lessons</Text>
          </div>

          <div className="w-[1px] h-3 bg-white" />

          <div className="flex items-center gap-1">
            <IconTime />
            <Text type="font-12-500">16 hours</Text>
          </div>
        </div>
        <Text type="font-16-500" className="line-clamp-1 capitalize">
          {item?.title}
        </Text>
        <div className="flex flex-col gap-[14px] border-b border-b-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Text type="font-14-500">4.1</Text>
            <RateStar rate={4} />
            <Text type="font-14-500">(230)</Text>
          </div>
          {item?.author?.walletAddress && (
            <Text type="font-14-400" className="break-words">
              By:  {item?.author?.walletAddress}
            </Text>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="py-[2px] px-2 flex justify-center items-center border-1 border-orange/50 bg-orange/10 rounded-full">
              <Text type="font-16-600" className="text-orange">
                {item?.originPrice ? `$${item?.originPrice}` : 'Free'}
              </Text>
            </div>
            {item?.price && (
              <Text type="font-14-400" className="text-black-6 line-through">
                $ {item.price}
              </Text>
            )}
          </div>

          <Button
            variant="light"
            radius="full"
            onClick={() => router.push(ROUTE_PATH.DETAIL_COURSE(item?.id))}
          >
            <div className="flex items-center gap-1">
              <Text type="font-14-500" className="text-white">
                Enroll Course
              </Text>
              <Image
                src={'/icons/ic-arrow-right-up-line.svg'}
                width={20}
                height={20}
                alt=""
              />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CardCourse;

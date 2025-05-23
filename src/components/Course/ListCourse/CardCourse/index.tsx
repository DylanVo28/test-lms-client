import IconDate from '@/components/UI/Icons/IconDate';
import IconTime from '@/components/UI/Icons/IconTime';
import RateStar from '@/components/UI/RateStar';
import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import { Button, Tooltip } from '@nextui-org/react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ReactStars from 'react-stars';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'next-i18next';
import IconArrowUp from '@/components/UI/Icons/IconArrowUp';
import { formatNumber, formatWalletAddress } from '@/utils/common';
import useNavigate from '@/hooks/useNavigate';

dayjs.extend(relativeTime);

const CardCourse = ({ item }: { item?: any }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const lessonCount = item?.sections?.reduce((total: number, section: any) => {
    return total + (section.lessons?.length || 0);
  }, 0);
  const { navigate } = useNavigate();

  const generateMentors = () => {
    if (item?.author?.fullName) {
      return item?.author?.fullName;
    }
    return formatWalletAddress(item?.author?.walletAddress);
  };
  return (
    <div
      onClick={() => {
        navigate(ROUTE_PATH.DETAIL_COURSE(item?.id));
      }}
      className="flex flex-col h-full rounded transition-all cursor-pointer  duration-300 hover:opacity-80"
    >
      <a
        href={item?.image || '/images/img-default.png'}
        target="_blank"
        onClick={(e) => e.preventDefault()}
        className="bg-white-10 rounded rounded-b-none"
      >
        {/* <div className="w-full rounded-b-none h-max rounded justify-center items-center bg-white/10"> */}
        <Image
          src={item?.image || '/images/img-default.png'}
          width={302}
          height={200}
          alt=""
          className="w-full h-[200px] bg-white-10"
          // layout="contain"
          // objectFit="scale-down"
          onError={(e: any) => {
            e.target.srcset = '/images/img-default.png';
          }}
        />
        {/* </div> */}
      </a>
      <div className="py-4 px-3 rounded-t-none rounded h-full bg-white-10 flex flex-col gap-[10px]">
        <div className="flex flex-col gap-[10px] flex-1 border-b border-b-white-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <IconDate />
              <Text type="font-12-500">
                {lessonCount} {t('Lessons')}
              </Text>
            </div>

            <div className="w-[1px] h-3 bg-white" />

            <div className="flex items-center gap-1">
              <IconTime />
              <Text type="font-12-500">
                {dayjs(item?.createdAt).fromNow(true)}
              </Text>
            </div>
          </div>
          <Text type="font-16-500" className="line-clamp-2 capitalize">
            {item?.title}
          </Text>
          <div className="flex flex-col gap-[14px]  pb-4">
            <div className="flex items-center gap-2">
              <Text type="font-14-500">{(item?.rating || 5)?.toFixed(1)}</Text>
              <ReactStars
                count={5}
                color1="#D9D9D9"
                color2="#F2B021"
                value={item?.rating || 5}
                size={16}
                edit={false}
                className="flex items-center gap-1 mb-1"
              />
              <Text type="font-14-500">{`(${item?.countReviews})`}</Text>
            </div>
            {item?.author?.walletAddress && (
              <Text type="font-14-400" className="text-main break-words">
                {t('By')}:  {generateMentors()}
              </Text>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <div className="py-[2px] px-2 flex justify-center items-center border-1 border-orange-50 bg-orange-10 rounded-full">
              <Text type="font-16-600" className="text-orange">
                {item?.price ? `$ ${formatNumber(item?.price)}` : t('Free')}
              </Text>
            </div>
            {item?.originPrice && (
              <Text type="font-14-400" className="text-black-6 line-through">
                $ {formatNumber(item.originPrice)}
              </Text>
            )}
          </div>

          <Button
            variant="light"
            radius="full"
            onPress={() => navigate(ROUTE_PATH.DETAIL_COURSE(item?.id))}
          >
            <div className="flex items-center gap-1">
              <Text type="font-14-500" className="text-white w-max">
                {t('Enroll Course')}
              </Text>
              <IconArrowUp />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CardCourse;

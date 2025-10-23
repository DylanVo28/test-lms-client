import IconLikeCourse from '@/components/UI/IconLikeCourse';
import IconDate from '@/components/UI/Icons/IconDate';
import IconLikedCourse from '@/components/UI/Icons/IconLikedCourse';
import IconTime from '@/components/UI/Icons/IconTime';
import RateStar from '@/components/UI/RateStar';
import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import { Button } from '@nextui-org/react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReactStars from 'react-stars';
import IconArrowUp from '@/components/UI/Icons/IconArrowUp';
import { formatNumber, formatWalletAddress } from '@/utils/common';
import useNavigate from '@/hooks/useNavigate';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'next-i18next';
dayjs.extend(relativeTime);

const CardCourse = ({
  item,
  noLike,
  handleLike,
  handleUnLike,
  isWishList,
}: {
  handleLike?: (id: string) => void;
  handleUnLike?: (id: string) => void;
  isWishList?: boolean;
  item: any;
  noLike?: boolean;
}) => {
  const accessToken = useAccessToken();
  const { t } = useTranslation('common');

  const {
    query: { code },
  } = useRouter();
  const { navigate } = useNavigate();

  const lessonCount = item?.sections?.reduce((total: number, section: any) => {
    return total + (section.lessons?.length || 0);
  }, 0);

  const generateMentors = () => {
    if (item?.author?.fullName) {
      return item.author.fullName;
    }
    return formatWalletAddress(item?.author?.walletAddress);
  };

  return (
    <Link
      href={`/${code}${ROUTE_PATH.DETAIL_COURSE(item.slug)}`}
      className="flex flex-col h-full rounded transition-all cursor-pointer relative duration-300 hover:opacity-80 bg-card"
    >
      {!noLike && (
        <div className="absolute right-2 top-2 z-10">
          <Button
            isIconOnly
            isDisabled={!accessToken}
            onPress={() => {
              if (item?.liked) {
                handleUnLike && handleUnLike(item?.id);
              } else {
                handleLike && handleLike(item?.id);
              }
            }}
            variant="light"
            className="hover:!bg-white-25 rounded-full"
          >
            {item?.liked || isWishList ? (
              <IconLikedCourse />
            ) : (
              <IconLikeCourse />
            )}
          </Button>
        </div>
      )}

      <div className="bg-card w-full rounded rounded-b-none">
        <Image
          src={item?.image ? item?.image : '/images/img-default.png'}
          width={302}
          height={200}
          alt=""
          layout="contain"
          className="w-full h-[160px] sm:h-[180px] md:h-[200px] rounded rounded-b-none bg-card object-cover"
          onError={(e: any) => {
            e.target.srcset = '/images/img-default.png';
          }}
        />
      </div>

      <div className="py-3 sm:py-4 px-3 w-full rounded rounded-t-none bg-card h-full flex flex-col gap-2 sm:gap-[10px]">
        <div className="flex flex-col gap-2 sm:gap-[10px] flex-1 border-b border-b-white-5 pb-2 sm:pb-3">
          {/* Course Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
            <div className="flex items-center gap-1">
              <IconDate />
              <Text type="font-12-500" className="text-letter sm:text-sm">
                {lessonCount} {t('card.lessons')}
              </Text>
            </div>

            <div className="hidden sm:block w-[1px] h-3 bg-white" />

            <div className="flex items-center gap-1">
              <IconTime />
              <Text type="font-12-500" className="text-letter sm:text-sm">
                {dayjs(item?.createdAt).fromNow(true)}
              </Text>
            </div>
          </div>

          {/* Course Title */}
          <Text
            type="font-14-500"
            className="line-clamp-2 capitalize text-letter leading-tight sm:text-base"
          >
            {item?.title}
          </Text>

          {/* Course Rating and Author */}
          <div className="flex flex-col gap-2 sm:gap-[8px]">
            <div className="flex items-center gap-2">
              <Text type="font-14-500" className="sm:text-sm">
                {(item?.rating || 5)?.toFixed(1)}
              </Text>
              <ReactStars
                count={5}
                color1="#D9D9D9"
                color2="#F2B021"
                value={item?.rating || 5}
                edit={false}
                size={14}
                className="flex items-center gap-1 mb-1"
              />
              <Text
                type="font-14-500"
                className="sm:text-sm"
              >{`(${item?.countReviews})`}</Text>
            </div>

            {item?.author?.walletAddress && (
              <div className="flex gap-0.5 break-words">
                <Text
                  type="font-14-500"
                  className="text-main break-words sm:text-sm"
                >
                  {t('card.mentor')}
                </Text>
                <Text
                  type="font-14-500"
                  className="text-main underline ml-2 sm:text-sm"
                >
                  {generateMentors()}
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Course Price */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="py-[2px] px-2 flex justify-center items-center border-1 border-secondary-50 bg-secondary-10 rounded-full">
              <Text type="font-14-500" className="text-secondary sm:text-base">
                {item?.price
                  ? `$ ${formatNumber(item?.price)}`
                  : t('card.free')}
              </Text>
            </div>
            {item?.originPrice && (
              <Text
                type="font-12-400"
                className="text-letter/70 line-through w-max sm:text-sm"
              >
                $ {formatNumber(item.originPrice)}
              </Text>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
export default CardCourse;

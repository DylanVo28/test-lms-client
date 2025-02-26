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
import { useTranslation } from 'next-i18next';
import { formatWalletAddress } from '@/utils/common';

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
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleClickCardCourse = () => {
    router.push(ROUTE_PATH.DETAIL_COURSE(item.id));
  };
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
    <div
      onClick={handleClickCardCourse}
      className="flex flex-col rounded transition-all min-w-[280px] md:min-w-full relative cursor-pointer duration-300 hover:opacity-80"
    >
      <div className="absolute left-2 top-2 bg-orange rounded-full py-[2px] px-2 flex items-center justify-center">
        <Text type="font-14-500" className="text-white">
          {t('Best seller')}
        </Text>
      </div>
      {!noLike && (
        <div className="absolute right-2 top-2">
          <Button
            isIconOnly
            onClick={() => {
              if (item?.liked) {
                handleUnLike && handleUnLike(item?.id);
              } else {
                handleLike && handleLike(item?.id);
              }
            }}
            variant="light"
            className="hover:!bg-white/25 rounded-full"
          >
            {item?.liked || isWishList ? (
              <IconLikedCourse />
            ) : (
              <IconLikeCourse />
            )}
          </Button>
        </div>
      )}

      <a
        href={item?.image || '/images/img-default.png'}
        target="_blank"
        onClick={(e) => e.preventDefault()}
        className="bg-white/10"
      >
        <Image
          src={item?.image ? item?.image : '/images/img-default.png'}
          width={302}
          height={200}
          alt=""
          layout="contain"
          className="w-full h-[200px] rounded rounded-b-none object-scale-down bg-white/10"
          objectFit="scale-down"
          onError={(e: any) => {
            e.target.srcset = '/images/img-default.png';
          }}
        />
      </a>
      <div className="flex-1 py-4 px-3 rounded bg-white/10 flex flex-col gap-[10px]">
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
        <div className="flex-1 flex flex-col gap-[14px] border-b border-b-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Text type="font-14-500">{item?.rating}</Text>
            <ReactStars
              count={5}
              color1="#D9D9D9"
              color2="#F2B021"
              value={item?.rating}
              size={16}
              className="flex items-center gap-1 mb-1"
            />
            <Text type="font-14-500">{`(${item?.countReviews})`}</Text>
          </div>
          {item?.author?.walletAddress && (
            <div className="flex gap-0.5 break-words">
              <Text type="font-14-400" className="text-main break-words">
                {t('By')}:
              </Text>
              <Text
                type="font-14-400"
                className="text-main underline break-all"
              >
                {generateMentors()}
              </Text>
            </div>
          )}
        </div>
        <div className="flex-wrap flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="py-[2px] px-2 flex justify-center items-center border-1 border-orange/50 bg-orange/10 rounded-full">
              <Text type="font-16-600" className="text-orange">
                {item?.originPrice ? `$ ${item?.originPrice}` : t('Free')}
              </Text>
            </div>
            {item?.price && (
              <Text type="font-14-400" className="text-black-6 line-through">
                $ {item.price}
              </Text>
            )}
          </div>
          <Button variant="light" radius="full" onClick={handleClickCardCourse}>
            <div className="flex items-center gap-1">
              <Text type="font-14-500" className="text-white">
                {t('Enroll Course')}
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

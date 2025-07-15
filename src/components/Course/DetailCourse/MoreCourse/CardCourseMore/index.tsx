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
import { useAccount } from 'wagmi';

dayjs.extend(relativeTime);

const CardCourseMore = ({
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
  const { navigate } = useNavigate();
  const accessToken = useAccessToken();

  const handleClickCardCourse = () => {
    navigate(ROUTE_PATH.DETAIL_COURSE(item.id));
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
      className="flex flex-col rounded transition-all min-w-max md:min-w-max lg:min-w-full relative  cursor-pointer duration-300 hover:opacity-80 h-full"
    >
      <div className="absolute left-2 top-2 bg-orange rounded-full py-[2px] px-2 flex items-center justify-center">
        <Text type="font-14-500" className="text-white">
          {'Best seller'}
        </Text>
      </div>
      {!noLike && (
        <div className="absolute right-2 top-2">
          <Button
            isIconOnly
            onPress={() => {
              if (item?.liked) {
                handleUnLike && handleUnLike(item?.id);
              } else {
                handleLike && handleLike(item?.id);
              }
            }}
            variant="light"
            isDisabled={!accessToken}
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

      <a
        href={item?.image || '/images/img-default.png'}
        target="_blank"
        onClick={(e) => e.preventDefault()}
        className="bg-white-10 w-full lg:w-max rounded rounded-b-none"
      >
        <Image
          src={item?.image ? item?.image : '/images/img-default.png'}
          width={302}
          height={200}
          alt=""
          layout="contain"
          className="w-full h-[200px] lg:w-max rounded rounded-b-none bg-white-10"
          // objectFit="scale-down"
          onError={(e: any) => {
            e.target.srcset = '/images/img-default.png';
          }}
        />
      </a>
      <div className="py-4 px-3 max-w-[302px] min-h-[196px] lg:min-w-[302px] lg:min-h-max lg:w-full rounded rounded-t-none bg-white-10 h-full flex flex-col gap-[10px]">
        <div className="flex flex-col gap-[10px] flex-1 border-b border-b-white-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <IconDate />
              <Text type="font-12-500">
                {lessonCount} {'Lessons'}
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
          <div className="flex flex-col gap-[14px] pb-4">
            <div className="flex items-center gap-2">
              <Text type="font-14-500">{item?.rating}</Text>
              <ReactStars
                count={5}
                color1="#D9D9D9"
                color2="#F2B021"
                value={item?.rating}
                edit={false}
                size={16}
                className="flex items-center gap-1 mb-1"
              />
              <Text type="font-14-500">{`(${item?.countReviews})`}</Text>
            </div>
            {item?.author?.walletAddress && (
              <div className="flex gap-0.5 break-words">
                <Text type="font-14-400" className="text-main break-words">
                  {'By'}:
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
        </div>

        <div className="flex-wrap md:flex-nowrap flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="py-[2px] px-2 flex justify-center items-center border-1 border-orange-50 bg-orange-10 rounded-full">
              <Text type="font-16-600" className="text-orange">
                {item?.price ? `$ ${formatNumber(item?.price)}` : 'Free'}
              </Text>
            </div>
            {item?.originPrice && (
              <Text
                type="font-14-400"
                className="text-black-6 line-through w-max"
              >
                $ {formatNumber(item.originPrice)}
              </Text>
            )}
          </div>
          <Button variant="light" radius="full" onPress={handleClickCardCourse}>
            <div className="flex items-center gap-1">
              <Text type="font-14-500" className="text-white">
                {'Enroll Course'}
              </Text>
              <IconArrowUp />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CardCourseMore;

import IconLike from '@/components/UI/IconLike';
import IconComment from '@/components/UI/Icons/IconComment';
import IconLikedCourse from '@/components/UI/Icons/IconLikedCourse';
import Text from '@/components/UI/Text';
import { useProfile } from '@/store/profile/useProfile';
import { Avatar, Button } from '@nextui-org/react';
import Image from 'next/image';
import { useMemo } from 'react';
import Rater from 'react-rater';
import ReactStars from 'react-stars';
import { useAccount } from 'wagmi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import IconLikeReview from '@/components/UI/Icons/IconLikeReview';
import IconUnLikeReview from '@/components/UI/Icons/IconUnLikeReview';
import IconLikedReview from '@/components/UI/Icons/IconLikedReview';
import { getAvatar, TypeReactions } from '@/utils/common';
import IconUnLikedReview from '@/components/UI/Icons/IconUnLikedReview';

dayjs.extend(relativeTime);

const Comment = ({
  item,
  handleLikeReview,
  handleUnLikeReview,
  handleDisLikeReview,
  handleUnDisLikeReview,
}: // handleUnLikeComment,
{
  item: any;
  handleLikeReview: (id: string) => void;
  handleUnLikeReview: (id: string) => void;
  handleDisLikeReview: (id: string) => void;
  handleUnDisLikeReview: (id: string) => void;
  // handleUnLikeComment: (id: string) => void;
}) => {
  const { address } = useAccount();
  const { profile } = useProfile();

  const meLiked = item?.reactions?.some(
    (reaction: any) => reaction?.userId === profile?.id
  );
  const meReaction = item?.reactions?.find(
    (reaction: any) => reaction?.userId === profile?.id
  );
  const idLikedMe = item?.reactions?.find(
    (reaction: any) => reaction?.userId === profile?.id
  )?.id;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Image
          src={item?.user?.avatar || getAvatar()}
          className="w-[24px] h-[24px] rounded-full"
          width={24}
          alt=""
          height={24}
          onError={(e: any) => {
            e.target.srcset = '/images/avatar-user.png';
          }}
        />

        <Text type="font-16-600" className="text-white">
          {item?.user?.fullName || address}
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <Text type="font-14-400" className="text-white">
          {item?.rating}
        </Text>
        <ReactStars
          count={5}
          color1="#D9D9D9"
          color2="#F2B021"
          value={item?.rating}
          size={14}
          className="flex items-center gap-1"
        />
        <Text type="font-14-500" className="text-black-7">
          {dayjs(item?.createdAt).fromNow(true)}
        </Text>
      </div>

      <Text type="font-16-400" className="text-black-3 w-9/12">
        {item?.review}
      </Text>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            onClick={() => {
              if (
                meLiked &&
                (meReaction?.name === TypeReactions?.LIKE ||
                  meReaction?.name === 'like')
              ) {
                handleUnLikeReview(idLikedMe);
              } else {
                handleLikeReview(item?.id);
              }
            }}
            size="md"
            radius="full"
            isIconOnly
            variant="light"
          >
            {meLiked &&
            (meReaction?.name === TypeReactions?.LIKE ||
              meReaction?.name === 'like') ? (
              <IconLikedReview />
            ) : (
              <IconLikeReview />
            )}
          </Button>
          <Text type="font-14-500" className="text-black-7">
            {
              item?.reactions?.filter(
                (item: any) =>
                  item?.name === TypeReactions?.LIKE || item?.name === 'like'
              )?.length
            }
          </Text>
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={() => {
              if (meLiked && meReaction?.name === TypeReactions?.DISLIKE) {
                handleUnDisLikeReview(idLikedMe);
              } else {
                handleDisLikeReview(item?.id);
              }
              // if (meLiked) {
              //   handleUnLikeReview(idLikedMe);
              // } else {
              //   handleLikeReview(item?.id);
              // }
            }}
            size="md"
            radius="full"
            isIconOnly
            variant="light"
          >
            {meLiked && meReaction?.name === TypeReactions?.DISLIKE ? (
              <IconUnLikedReview />
            ) : (
              <IconUnLikeReview />
            )}
          </Button>
          <Text type="font-14-500" className="text-black-7">
            {
              item?.reactions?.filter(
                (item: any) => item?.name === TypeReactions?.DISLIKE
              )?.length
            }
          </Text>
        </div>

        {/* <div className="flex items-center gap-1 cursor-pointer">
          <IconComment />
          <Text type="font-14-500" className="text-black-7">
            0
          </Text>
        </div> */}
        {/* <div
          onClick={() => {
            // if (meLiked) {
            //   handleUnLikeComment(idLikedMe);
            // } else {
            //   handleLikeComment(item?.id);
            // }
          }}
          className="flex items-center gap-1 cursor-pointer"
        >
          {meLiked ? <IconLikedCourse /> : <IconLike />}
          <Text type="font-14-500" className="text-black-7">
            {item?.reactions?.length}
          </Text>
        </div> */}
      </div>
    </div>
  );
};
export default Comment;

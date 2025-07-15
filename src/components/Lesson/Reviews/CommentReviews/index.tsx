import IconLike from '@/components/UI/IconLike';
import IconComment from '@/components/UI/Icons/IconComment';
import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Rater from 'react-rater';
const CommentReviews = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Image
          alt=""
          src={'/images/avatar.png'}
          width={24}
          height={24}
          className="rounded-full"
        />

        <Text type="font-16-600" className="text-white">
          Darlene Robertson
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <Text type="font-14-400" className="text-white">
          4.1
        </Text>
        <Rater total={5} rating={4} />
        <Text type="font-14-500" className="text-black-7">
          {'36m ago'}
        </Text>
      </div>

      <Text type="font-16-400" className="text-black-3 w-9/12">
        {"We're not allowed to buy from only relatives. Let's buy this coin. We'll reach 3M. Go ahead, friends. @InfernoDAO_ $INF"}
      </Text>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 cursor-pointer">
          <IconComment />
          <Text type="font-14-500" className="text-black-7">
            0
          </Text>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <IconLike />
          <Text type="font-14-500" className="text-black-7">
            0
          </Text>
        </div>
      </div>
    </div>
  );
};
export default CommentReviews;

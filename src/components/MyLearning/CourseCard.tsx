import React from 'react';
import Text from '@/components/UI/Text';
import RateStar from '../UI/RateStar';
import Image from 'next/image';
import { ROUTE_PATH } from '@/utils/const';
import { useRouter } from 'next/router';
import ReactStars from 'react-stars';
import { useTranslation } from 'next-i18next';
import { formatWalletAddress } from '@/utils/common';
import useNavigate from '@/hooks/useNavigate';

interface IProps {
  id: string;
  image: string;
  progress: number;
  name: string;
  author: any;
  course: any;
  countReviews: number;
}

export default function CourseCard({
  id,
  name,
  progress = 0,
  author,
  image,
  course,
  countReviews,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { navigate } = useNavigate();

  const generateMentors = () => {
    if (author?.fullName) {
      return author?.fullName;
    }
    return formatWalletAddress(author?.walletAddress);
  };

  console.log('progress', progress);

  return (
    <div
      className="w-full bg-[#FFFFFF0D] rounded overflow-hidden cursor-pointer"
      onClick={() => navigate(ROUTE_PATH.DETAIL_LESSON(id))}
    >
      <div className="w-full">
        <a
          href={image || '/images/img-default.png'}
          target="_blank"
          onClick={(e) => e.preventDefault()}
        >
          <Image
            src={image || '/images/img-default.png'}
            alt={name}
            width={302}
            height={200}
            className="w-full h-[200px] object-scale-down"
            layout="contain"
            objectFit="scale-down"
            onError={(e: any) => {
              e.target.srcset = '/images/img-default.png';
            }}
          />
        </a>
      </div>
      <div className="py-4 px-3 flex flex-col gap-4">
        <div className="flex flex-col gap-[10px]">
          <Text type="font-16-500">{name}</Text>

          <Text type="font-14-400" className="text-[#8C8C8C] break-all">
            {generateMentors()}
          </Text>
        </div>
        <ProgressBar progress={Number((progress * 100).toFixed(0))} />
        <div className="flex items-center justify-between">
          <Text type="font-14-500">
            {t('{{progress}}% complete', {
              progress: (progress * 100 > 100 ? 100 : progress * 100).toFixed(
                0
              ),
            })}
          </Text>
          <div className="flex items-center gap-2">
            <ReactStars
              count={5}
              color1="#D9D9D9"
              color2="#F2B021"
              value={course?.rating}
              size={16}
              edit={false}
              className="flex items-center gap-1 mb-1"
            />
            <Text type="font-14-500">
              {countReviews ? `(${countReviews})` : `(0)`}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full bg-[#FFFFFF1A] rounded-full h-2 overflow-hidden">
      <div
        className="bg-[#1DB78D] h-full transition-all duration-300 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

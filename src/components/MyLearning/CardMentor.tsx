import React from 'react';
import Text from '@/components/UI/Text';
import RateStar from '../UI/RateStar';
import Image from 'next/image';
import { ROUTE_PATH } from '@/utils/const';
import { useRouter } from 'next/router';
import ReactStars from 'react-stars';
import Rater from 'react-rater';

interface IProps {
  mentor?: any;
}

export default function CardMentor({ mentor }: IProps) {
  const router = useRouter();
  const generateMentors = () => {
    if (mentor?.firstName || mentor?.author?.lastName) {
      return `${mentor?.author?.firstName || ''} ${
        mentor?.author?.lastName || ''
      }`;
    }
    return mentor?.author?.walletAddress || 'Jonas Schmedtmann';
  };
  return (
    <div className="w-full bg-[#FFFFFF0D] rounded-[4px] overflow-hidden cursor-pointer flex flex-row gap-3 p-4">
      <Image
        src={mentor?.avatar || '/images/img-default.png'}
        alt={'avatar'}
        width={64}
        height={64}
        className="h-[64px] w-[64px] rounded-full"
        layout="contain"
        onError={(e: any) => {
          e.target.srcset = '/images/img-default.png';
        }}
      />
      <div className="flex flex-col gap-1 flex-1">
        <Text type="font-18-600">{generateMentors()}</Text>
        <Text type="font-16-400">
          {mentor?.headline || 'Senior Web Developer'}
        </Text>
        <div className="flex items-center gap-2 flex-row">
          <Text type="font-14-400" className="text-white">
            {mentor?.instructorInfo?.avgRate?.toFixed(1) || 0}
          </Text>
          <Rater
            total={5}
            rating={mentor?.instructorInfo?.avgRate?.toFixed(1) || 0}
          />
        </div>
        <div className="flex flex-row items-center gap-1">
          <Text type="font-14-700">
            {mentor?.instructorInfo?.countStudents || 0}
          </Text>
          <Text type="font-14-400">students</Text>
        </div>
        <div className="flex flex-row items-center gap-1">
          <Text type="font-14-700">
            {mentor?.instructorInfo?.countCourses || 0}
          </Text>
          <Text type="font-14-400">courses</Text>
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

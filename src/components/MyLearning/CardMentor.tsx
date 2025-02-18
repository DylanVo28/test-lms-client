import React from 'react';
import Text from '@/components/UI/Text';
import Image from 'next/image';

import Rater from 'react-rater';
import { useTranslation } from 'next-i18next';

interface IProps {
  mentor?: any;
}

export default function CardMentor({ mentor }: IProps) {
  const { t } = useTranslation('common');

  const generateMentors = () => {
    if (mentor?.firstName || mentor?.lastName) {
      return `${mentor?.firstName || ''} ${mentor?.author?.lastName || ''}`;
    }
    return mentor?.walletAddress;
  };
  return (
    <div className="w-full bg-[#FFFFFF0D] rounded-[4px] overflow-hidden cursor-pointer flex flex-row gap-3 p-4">
      <div className="h-[64px] w-[64px]">
        <Image
          src={mentor?.avatar || '/images/img-default.png'}
          alt={'avatar'}
          width={64}
          height={64}
          className="rounded-full h-full w-full object-cover"
          layout="contain"
          onError={(e: any) => {
            e.target.srcset = '/images/img-default.png';
          }}
        />
      </div>
      <div className="flex flex-col gap-1 flex-grow">
        <Text
          type="font-18-600"
          className="truncate 2xl:max-w-[240px] xl:max-w-[200px] md:max-w-[120px] sm:max-w-[120px]"
        >
          {generateMentors()}
        </Text>
        <Text type="font-16-400">{mentor?.headline}</Text>
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
          <Text type="font-14-400">{t('students')}</Text>
        </div>
        <div className="flex flex-row items-center gap-1">
          <Text type="font-14-700">
            {mentor?.instructorInfo?.countCourses || 0}
          </Text>

          <Text type="font-14-400">{t('courses')}</Text>
        </div>
      </div>
    </div>
  );
}

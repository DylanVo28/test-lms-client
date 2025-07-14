import IconCoppyRight from '@/components/UI/IconCoppyRight';
import IconGlobal from '@/components/UI/Icons/IconGlobal';
import IconUpload from '@/components/UI/Icons/IconUpload';
import Text from '@/components/UI/Text';
import ByTheNumbers from './ByTheNumbers';
import Description from './Description';
import RateStar from '@/components/UI/RateStar';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { formatTimeDuration } from '@/utils/common';
import ReactStars from 'react-stars';
import { useTranslation } from 'next-i18next';

const Overview = ({ dataListSection, dataDetail }: any) => {
  const { t } = useTranslation('common');
  const formattedTime: string = useMemo(() => {
    const totalDuration = dataListSection?.reduce(
      (total: any, section: any) => {
        const videoLessons = section?.lessons?.filter(
          (lesson: any) => lesson?.contentType === 'VIDEO'
        );
        const durationSum = videoLessons?.reduce(
          (sum: any, lesson: any) => sum + (lesson?.info?.duration || 0),
          0
        );
        return total + durationSum;
      },
      0
    );

    const minutes = Math.floor(totalDuration / 60);
    const seconds = Math.floor(totalDuration % 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

    return formattedTime;
  }, [dataListSection]);

  return (
    <div className="flex flex-col gap-5 md:p-4 lg:pl-[80px] lg:pr-[32px]">
      <Text className="text-white" type="font-20-700">
        {dataDetail?.data?.subtitle}
      </Text>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-10">
            <div className="flex flex-col gap-[3px]">
              <div className="flex items-center gap-1">
                <Text className="text-white" type="font-14-700">
                  {+(dataDetail?.data?.rating || 5)?.toFixed(1)}
                </Text>
                <ReactStars
                  count={5}
                  color1="#D9D9D9"
                  color2="#F2B021"
                  value={+(dataDetail?.data?.rating || 5)}
                  size={16}
                  className="flex items-center gap-1 mb-1"
                  edit={false}
                />
              </div>
              <Text className="text-black-7" type="font-14-400">
                {`${dataDetail?.data?.countReviews} ${t('rating')}`}
              </Text>
            </div>
            <div className="flex flex-col gap-[6px]">
              <Text className="text-white" type="font-14-700">
                {dataDetail?.data?.userCourses?.length ||
                  dataDetail?.data?.countStudents}
              </Text>
              <Text className="text-black-7" type="font-14-400">
                {t('Students')}
              </Text>
            </div>
            <div className="flex flex-col gap-[6px]">
              <Text className="text-white" type="font-14-700">
                {formatTimeDuration(formattedTime)}
              </Text>
              <Text className="text-black-7" type="font-14-400">
                {t('Total')}
              </Text>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <IconUpload />
              <Text className="text-black-5" type="font-14-400">
                {t('Last Updated')}{' '}
                {dayjs(dataDetail?.data?.updatedAt).format('MMMM YYYY')}
              </Text>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <IconGlobal />
                <Text className="text-black-5" type="font-14-400">
                  {t('English')}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <IconCoppyRight />
                <Text className="text-black-5" type="font-14-400">
                  {t('English (auto)')}
                </Text>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <ByTheNumbers course={dataDetail?.data} />
          <Description description={dataDetail?.data?.description} />
        </div>
      </div>
    </div>
  );
};
export default Overview;

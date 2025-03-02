import IconDate from '@/components/UI/Icons/IconDate';
import IconTime from '@/components/UI/Icons/IconTime';
import RateStar from '@/components/UI/RateStar';
import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEnrollCourse } from './service';
import { getAccessToken } from '@/store/auth';
import CustomButtonEnroll from '@/components/UI/CustomButtonEnroll';
import { useProfile } from '@/store/profile/useProfile';
import { useTranslation } from 'next-i18next';
import useNavigate from '@/hooks/useNavigate';
import { toast } from '@/components/UI/Toast/toast';
import { error } from 'console';

const DATA_NOTE = [
  '12 hours of on-demand video',
  'Exercises',
  '1 downloadable resource',
  'Mobile and TV access',
  'Timed access',
  'Certificate of completion',
];

const CardEnrollNow = ({ course }: { course: any }) => {
  console.log(course, 'course');
  const { t } = useTranslation('common');
  const router = useRouter();
  const token = getAccessToken();
  const { profile } = useProfile();
  const { navigate } = useNavigate();

  const { run, loading } = useEnrollCourse({
    onSuccess: (res) => {
      console.log(res, 'res123');

      if (res?.data?.courseId) {
        navigate(ROUTE_PATH.DETAIL_LESSON(res?.data?.courseId));
      }
    },
    onError: (err) => {
      toast.error(err?.message)
    }
  });
  const discountCalculator = (originPrice: any, price: any) => {
    const discountPercentage = ((originPrice - price) / originPrice) * 100;

    return `${discountPercentage.toFixed(0)}%`;
  };

  return (
    <div className="rounded transition-all cursor-pointer duration-300">
      <div className="relative flex justify-center items-center">
        <Image
          src={course?.image || '/images/img-default.png'}
          width={302}
          height={200}
          alt=""
          className="w-full h-[200px] rounded rounded-b-none opacity-80"
          onError={(e: any) => {
            e.target.srcset = '/images/img-default.png';
          }}
        />
        <Image
          src={'/images/img-youtube.png'}
          width={64}
          height={64}
          alt=""
          className="absolute"
        />
      </div>

      <div className="p-4 rounded bg-white/10 flex flex-col gap-[10px]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Text type="font-20-400" className="text-orange">
                {course?.originPrice ? `$ ${course?.originPrice}` : t('Free')}
              </Text>
              {course?.price && (
                <Text type="font-14-400" className="text-black-6 line-through">
                  $ {course?.price}
                </Text>
              )}
              {/* <div className="py-[2px] px-2 flex justify-center items-center border-1 border-orange/50 bg-orange/10 rounded-full">
                <Text type="font-16-600" className="text-orange">
                  {course?.price ? `$${course?.price}` : 'Free'}
                </Text>
              </div>
              {course?.price && (
                <Text type="font-14-400" className="text-black-6 line-through">
                  ${course?.price * 1.5}
                </Text>
              )} */}
            </div>
            {course?.originPrice && course?.price && (
              <div className="rounded-full border-1 border-[#F26F2133] py-1 px-3 bg-[#F26F2133] flex items-center gap-1">
                <Text type="font-14-500" className="text-[#F26F21]">
                  {discountCalculator(course?.originPrice, course?.price)}
                </Text>
                <Text type="font-14-500" className="text-[#F26F21]">
                  {t('OFF')}
                </Text>
              </div>
            )}

            {/* {!course?.isOwner && (
              <Button
                variant="light"
                radius="full"
                onClick={() => {
                  if (course?.isOwner) return;
                  run(course.id);
                }}
              >
                <div className="flex items-center gap-1">
                  <Text type="font-14-500" className="text-white">
                    Enroll Course
                  </Text>
                  <Image
                    src={'/icons/ic-arrow-right-up-line.svg'}
                    width={20}
                    height={20}
                    alt=""
                  />
                </div>
              </Button>
            )} */}
          </div>
          {profile?.id !== course?.author?.id && (
            <CustomButtonEnroll
              course={course}
              handleClickButton={() => {
                if (course?.isOwner || course?.authorId === profile?.id) {
                  navigate(ROUTE_PATH.DETAIL_LESSON(course?.id));
                } else {
                  run(course.id);
                }
              }}
              loading={loading}
              token={token}
              label={t('Enroll Now')}
            />
          )}

          <div className="flex flex-col gap-2">
            <Text className="text-white" type="font-18-600">
              {t('This course includes')}
            </Text>
            <div className="flex flex-col gap-1">
              {DATA_NOTE?.map((item) => {
                return (
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-black-6 rounded-full" />
                    <Text className="text-black-6" type="font-16-400">
                      {t(item)}
                    </Text>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardEnrollNow;

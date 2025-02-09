import { useGetDetailCourse } from '@/components/CreateCourse/service';
import { valueProgressAtom } from '@/components/Lesson';
import IconArrowDown from '@/components/UI/Icons/IconArrowDown';
import IconArrowLeft from '@/components/UI/Icons/IconArrowLeft';
import IconDots from '@/components/UI/Icons/IconDots';
import ProgressCircle from '@/components/UI/ProgressCircle';
import Text from '@/components/UI/Text';
import { useProfile } from '@/store/profile/useProfile';
import { ROUTE_PATH } from '@/utils/const';
import { Button, CircularProgress } from '@nextui-org/react';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

const LessonLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [valueYourProgress] = useAtom(valueProgressAtom);
  const { profile } = useProfile();

  const { run: getDetailCourse, data: dataDetail } = useGetDetailCourse({
    onSuccess: () => {},
  });

  useEffect(() => {
    if (router.query.id) {
      getDetailCourse(router.query.id as string, profile?.id);
    }
  }, [router.query.id, profile?.id]);

  return (
    <div className="w-screen bg-primary h-screen overflow-auto overflow-x-hidden flex flex-col relative">
      <div className="flex py-6 px-4 border-b-1 border-b-black-9 justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1">
            <Button
              onClick={() =>
                router.push(ROUTE_PATH.DETAIL_COURSE(router.query.id))
              }
              isIconOnly
              radius="full"
              size="md"
              variant="light"
            >
              <IconArrowLeft />
            </Button>
            <Text type="font-16-500" className="text-white">
              Home
            </Text>
          </div>
          <div className="w-[1px] h-6 bg-black-6" />
          <Text type="font-16-500" className="text-white">
            {dataDetail?.data?.title}
          </Text>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex items-center justify-center relative">
              <div className="absolute">
                <Image
                  src="/images/img-trophy-line.png"
                  width={16}
                  height={16}
                  alt="Trophy"
                  className="w-5 h-5"
                />
              </div>
              <CircularProgress
                classNames={{
                  svg: 'w-[32px] h-[32px]',
                  indicator: 'text-green',
                }}
                maxValue={valueYourProgress?.total}
                value={valueYourProgress?.value}
                size="sm"
              />
            </div>

            <Text type="font-16-500" className="text-white">
              Your Progress
            </Text>
            <IconArrowDown />
          </div>
          <Button
            className="rounded w-[82px] bg-transparent border-1 border-black-5"
            size="lg"
          >
            <div className="flex items-center gap-1">
              <Text type="font-16-500" className="text-white">
                Share
              </Text>
              <IconArrowDown />
            </div>
          </Button>
          <Button
            isIconOnly
            className="rounded bg-transparent border-1 border-black-5"
            size="lg"
          >
            <IconDots />
          </Button>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
export default LessonLayout;

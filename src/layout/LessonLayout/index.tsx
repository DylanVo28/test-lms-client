import { useGetDetailCourse } from '@/components/CreateCourse/service';
import { valueProgressAtom } from '@/components/Lesson';
import IconArrowDown from '@/components/UI/Icons/IconArrowDown';
import IconArrowLeft from '@/components/UI/Icons/IconArrowLeft';
import IconDots from '@/components/UI/Icons/IconDots';
import ModalShare from '@/components/UI/ModalShare';
import ProgressCircle from '@/components/UI/ProgressCircle';
import Text from '@/components/UI/Text';
import { useProfile } from '@/store/profile/useProfile';
import { ROUTE_PATH } from '@/utils/const';
import { Button, CircularProgress } from '@nextui-org/react';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import MainHeader from '../MainLayout/MainHeader';
import { useTranslation } from 'next-i18next';
import IconCup from '@/components/UI/Icons/IconCup';

const LessonLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [valueYourProgress] = useAtom(valueProgressAtom);
  const { profile } = useProfile();
  const refModalShare: any = useRef(null);

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
      {isMobile ? (
        <MainHeader />
      ) : (
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
                {t('Home')}
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
                  <IconCup />
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
                {t('Your Progress')}
              </Text>
              <IconArrowDown />
            </div>
            <Button
              onClick={() => refModalShare.current.onOpen()}
              className="rounded w-[90px] border-white-10 border-1 bg-white-10"
              size="lg"
            >
              <div className="flex items-center gap-1">
                <Text type="font-16-500" className="text-white">
                  {t('Share')}
                </Text>
                <IconShare />
              </div>
            </Button>
            {/* <Button
            isIconOnly
            className="rounded bg-transparent border-1 border-black-5"
            size="lg"
          >
            <IconDots />
          </Button> */}
          </div>
        </div>
      )}

      <div className="w-full">{children}</div>

      <ModalShare ref={refModalShare} />
    </div>
  );
};
export default LessonLayout;

const IconShare = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
    >
      <path
        d="M11.3332 11.6667V15.8333L19.6665 9.16667L11.3332 2.5V6.66667C6.73067 6.66667 2.99984 10.3975 2.99984 15C2.99984 15.2275 3.00817 15.4525 3.0265 15.675C3.66284 14.4651 4.61777 13.4522 5.78807 12.7458C6.95836 12.0393 8.2995 11.6661 9.6665 11.6667H11.3332Z"
        fill="var(--theme-white)"
      />
    </svg>
  );
};

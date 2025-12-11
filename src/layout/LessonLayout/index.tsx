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
import {
  Button,
  CircularProgress,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isMobile } from 'react-device-detect';
import MainHeader from '../MainLayout/MainHeader';
import IconCup from '@/components/UI/Icons/IconCup';
import useNavigate from '@/hooks/useNavigate';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const LessonLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [valueYourProgress] = useAtom(valueProgressAtom);
  const { profile } = useProfile();
  const refModalShare: any = useRef(null);
  const { navigate } = useNavigate();

  const token = useAccessToken();

  const { requestGetProfile } = useProfileInitial();

  // React Query: fetch profile once when token exists and profile not loaded
  useQuery({
    queryKey: ['profile', token],
    queryFn: async () => requestGetProfile(),
    enabled: Boolean(token && !profile?.id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { run: getDetailCourse, data: dataDetail } = useGetDetailCourse({
    onSuccess: () => {},
  });

  useEffect(() => {
    if (router.query.id) {
      getDetailCourse(router.query.id as string, profile?.id);
    }
  }, [router.query.id, profile?.id]);

  // Guard: redirect if user hasn't purchased and isn't the owner
  useEffect(() => {
    // If not logged in (e.g., wallet switched -> logout), block access
    if (!profile?.id) {
      navigate(ROUTE_PATH.HOME);
      return;
    }

    if (!dataDetail?.data) return;

    const isOwner =
      dataDetail?.data?.isOwner || dataDetail?.data?.authorId === profile?.id;
    const isEnrolled = dataDetail?.data?.enroll === 'verified';

    if (!isOwner && !isEnrolled) {
      navigate(ROUTE_PATH.HOME);
    }
  }, [profile?.id, dataDetail?.data?.enroll, dataDetail?.data?.authorId]);

  const safeTotal = Math.max(valueYourProgress?.total || 1, 1);
  const safeValue = Math.min(valueYourProgress?.value || 0, safeTotal);
  const progessPercent = (safeValue / safeTotal) * 100;

  return (
    <div className="w-screen bg-primary h-screen overflow-auto overflow-x-hidden flex flex-col relative">
      {isMobile ? (
        <MainHeader />
      ) : (
        <div className="flex md:flex-row flex-col  md:py-6 py-3 md:px-4 border-b-1 border-b-black-9 justify-between items-between">
          <div className="flex items-center md:gap-5 gap-3">
            <div className="flex items-center gap-1">
              <Button
                onPress={() => {
                  try {
                    if (typeof window !== 'undefined' && dataDetail?.data && router.query.id) {
                      window.sessionStorage.setItem(
                        `courseDetail:${router.query.id}`,
                        JSON.stringify(dataDetail.data)
                      );
                    }
                  } catch {}
                  // Prefer client history to avoid reload flicker
                  if (typeof window !== 'undefined' && window.history.length > 1) {
                    router.back();
                  } else {
                    navigate(ROUTE_PATH.DETAIL_COURSE(router.query.id));
                  }
                }}
                className="hover:bg-black-10 py-3 px-0"
                radius="md"
                size="md"
                variant="light"
              >
                <div className="flex items-center gap-2">
                  <IconArrowLeft />

                  <Text type="font-16-500" className="text-letter">
                    {'Home'}
                  </Text>
                </div>
              </Button>
            </div>
            <div className="w-[1px] h-6 bg-black-6" />
            <Text
              type="font-16-500"
              className="text-letter whitespace-nowrap line-clamp-1 flex-1 overflow-hidden text-ellipsis"
            >
              {dataDetail?.data?.title}
            </Text>
          </div>
          <div className="flex items-center md:gap-5 gap-3 justify-between px-3">
            <Popover placement="bottom" showArrow={true}>
              <PopoverTrigger>
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
                      maxValue={safeTotal}
                      value={safeValue}
                      size="sm"
                    />
                  </div>
                  <div className="flex gap-x-1 items-center">
                    <Text
                      type="font-16-500"
                      className="text-letter whitespace-nowrap line-clamp-1"
                    >
                      {t('lesson.header.yourProgress')}
                    </Text>
                    <IconArrowDown />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="rounded-lg">
                {progessPercent >= 80 ? (
                  <div className="px-1 py-2 flex flex-col gap-3">
                    <div className="font-bold text-lg text-letter">
                      {t('lesson.header.completedCourse')}
                    </div>
                    <Link
                      href={`${window.location.origin}/${router.query.code}/${ROUTE_PATH.MY_LEARNING}`}
                      className="text-sm text-main underline font-bold"
                    >
                      {t('lesson.header.viewCertificate')}
                    </Link>
                  </div>
                ) : (
                  <div className="px-1 py-2 flex flex-col gap-3">
                    <div className="text-lg font-bold text-letter">
                      {t('lesson.header.completedOf', {
                        completed: safeValue,
                        total: valueYourProgress?.total ?? 0,
                      })}
                    </div>
                    <div className="text-sm ">
                      {t('lesson.header.finishToGetCertificate')}
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <Button
              onClick={() => refModalShare.current.onOpen()}
              className="rounded w-[90px] border-white-10 border-1 bg-card"
              size="lg"
            >
              <div className="flex items-center gap-1">
                <Text type="font-16-500" className="text-letter">
                  {t('lesson.header.share')}
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

      <ModalShare ref={refModalShare} courseSlug={dataDetail?.data?.slug} />
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
        fill="var(--theme-letter)"
      />
    </svg>
  );
};

import { TabMyLearning } from '@/components/MyLearning';
import Text from '@/components/UI/Text';
import useNavigate from '@/hooks/useNavigate';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useProfile } from '@/store/profile/useProfile';
import { ROUTE_PATH } from '@/utils/const';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';
import { privateRequest, request } from '@/api/request';
import { API_PATH } from '@/api/constant';

// Function to fetch list of my courses (same as in service.ts)
const getListMyCourse = async (params: any) => {
  return await privateRequest(request.get, API_PATH.MY_COURSE, { params });
};

const Menubar = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { profile } = useProfile();
  const { navigate } = useNavigate();
  const { address } = useAccount();
  const accessToken = useAccessToken();
  const { login } = usePrivy();
  const queryClient = useQueryClient();

  const MENUS = useMemo(
    () =>
      profile?.role === 'KOL' || profile?.role === 'ADMIN'
        ? [
            {
              key: 1,
              label: t('header.myLearning'),
              href: ROUTE_PATH.MY_LEARNING,
            },
            {
              key: 2,
              label: t('header.wishList'),
              href: `${ROUTE_PATH.MY_LEARNING}?type=${TabMyLearning.WISHLIST}`,
            },
            {
              key: 3,
              label: t('header.teach'),
              href: ROUTE_PATH.LIST_COURSE,
            },
            {
              key: 4,
              label: t('header.trade'),
              href: 'https://trade.what.exchange/',
              isExternal: true,
            },
          ]
        : [
            {
              key: 1,
              label: t('header.myLearning'),
              href: ROUTE_PATH.MY_LEARNING,
            },
            {
              key: 2,
              label: t('header.wishList'),
              href: `${ROUTE_PATH.MY_LEARNING}?type=${TabMyLearning.WISHLIST}`,
            },
            {
              key: 4,
              label: t('header.trade'),
              href: 'https://trade.what.exchange/',
              isExternal: true,
            },
          ],
    [profile?.role, t]
  );
  // Prefetch list course data on hover
  const handleMouseEnterListCourse = () => {
    if (!profile?.id || !accessToken) return;

    const defaultParams = {
      order: 'createdAt desc',
      search: '',
      pageSize: 5,
      page: 1,
    };

    queryClient.prefetchInfiniteQuery({
      queryKey: ['myCourses', defaultParams, profile?.id],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await getListMyCourse({
          ...defaultParams,
          page: pageParam,
          userId: profile?.id,
        });
        return response;
      },
      getNextPageParam: (lastPage, allPages) => {
        const totalPage = lastPage?.meta?.totalPage || 0;
        const next = allPages.length + 1;
        return allPages.length < totalPage ? next : undefined;
      },
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const handleClickRedirectPage = (key: number) => {
    const menuItem = MENUS.find((item) => item.key === key);

    // Handle external links (like Trade)
    if (menuItem?.isExternal && menuItem?.href) {
      window.open(menuItem.href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!accessToken) {
      login();
      return;
    }

    if (key === 2 && menuItem?.href) {
      const url = menuItem?.href;
      const resultUrl = url.split('?')[0];
      navigate(resultUrl, { type: TabMyLearning.WISHLIST });
    } else {
      menuItem?.href && navigate(menuItem?.href);
    }
  };
  const cleanedPath = router.pathname.replace(/^\/\[[^/]+\]/, '');

  return (
    <div className="flex items-center gap-8">
      {MENUS?.map((item) => {
        // Add prefetch on hover for "Teach" menu (LIST_COURSE)
        const handleMouseEnter = item?.key === 3 && item?.href === ROUTE_PATH.LIST_COURSE
          ? handleMouseEnterListCourse
          : undefined;

        return (
          <Text
            key={item?.key}
            onClick={() => handleClickRedirectPage(item?.key)}
            onMouseEnter={handleMouseEnter}
            className={clsx(
              'cursor-pointer transition-all hover:text-main text-letter/50 ',
              {
                'text-main font-bold': router.query.type
                  ? router.query.type === TabMyLearning.WISHLIST &&
                    item?.key === 2
                  : item.href === cleanedPath,
              }
            )}
            type="font-16-500"
          >
            {item?.label}
          </Text>
        );
      })}
    </div>
  );
};
export default Menubar;

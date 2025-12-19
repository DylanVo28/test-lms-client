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

const Menubar = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { profile } = useProfile();
  const { navigate } = useNavigate();
  const { address } = useAccount();
  const accessToken = useAccessToken();
  const { login } = usePrivy();

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
          ],
    [profile?.role, t]
  );
  const handleClickRedirectPage = (key: number) => {
    if (!accessToken) {
      login();
      return;
    }
    const menuItem = MENUS.find((item) => item.key === key);
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
        return (
          <Text
            key={item?.key}
            onClick={() => handleClickRedirectPage(item?.key)}
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

import { TabMyLearning } from '@/components/MyLearning';
import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import DrawerMenu from './DrawerMenu';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useProfile } from '@/store/profile/useProfile';

const Menubar = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { profile } = useProfile();
  const MENUS = useMemo(
    () =>
      profile?.role === 'KOL'
        ? [
            {
              key: 1,
              label: 'My learning',
              href: ROUTE_PATH.MY_LEARNING,
            },
            {
              key: 2,
              label: 'Wish list',
              href: `${ROUTE_PATH.MY_LEARNING}?type=${TabMyLearning.WISHLIST}`,
            },
            {
              key: 3,
              label: 'Teach',
              href: ROUTE_PATH.LIST_COURSE,
            },
          ]
        : [
            {
              key: 1,
              label: 'My learning',
              href: ROUTE_PATH.MY_LEARNING,
            },
            {
              key: 2,
              label: 'Wish list',
              href: `${ROUTE_PATH.MY_LEARNING}?type=${TabMyLearning.WISHLIST}`,
            },
          ],
    [profile?.role]
  );
  const handleClickRedirectPage = (key: number) => {
    const menuItem = MENUS.find((item) => item.key === key);
    if (menuItem?.href) {
      router.push(menuItem?.href);
    }
  };

  return (
    <div className="flex items-center gap-8">
      {MENUS?.map((item) => {
        return (
          <Text
            key={item?.key}
            onClick={() => handleClickRedirectPage(item?.key)}
            className={clsx(
              'cursor-pointer transition-all hover:text-main text-black-5 ',
              {
                'text-main font-bold': router.query.type
                  ? router.query.type === TabMyLearning.WISHLIST &&
                    item?.key === 2
                  : item.href === router.pathname,
              }
            )}
            type="font-16-600"
          >
            {t(item?.label)}
          </Text>
        );
      })}
    </div>
  );
};
export default Menubar;

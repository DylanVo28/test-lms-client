import { TabMyLearning } from '@/components/MyLearning';
import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import { Drawer, DrawerBody, DrawerContent } from '@nextui-org/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'next-i18next';

const MENUS = [
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
];

const DrawerMenu = (props: any, ref: any) => {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);

  const router = useRouter();
  const handleClickRedirectPage = (key: number) => {
    const menuItem = MENUS.find((item) => item.key === key);
    if (menuItem?.href) {
      router.push(menuItem?.href);
      onVisible();
    }
  };

  const onVisible = () => {
    setVisible(!visible);
  };
  useImperativeHandle(ref, () => {
    return {
      onOpen: () => {
        setVisible(true);
      },
      onClose: () => setVisible(false),
    };
  });

  return (
    <Drawer
      radius="none"
      hideCloseButton
      size="xs"
      isOpen={visible}
      onClose={onVisible}
    >
      <DrawerContent>
        <>
          <DrawerBody className="p-0">
            <div className="flex flex-col">
              <div className="py-4 px-4 flex items-center border-b-1 border-white-10 justify-between">
                <Text type="font-20-600" className="text-white">
                  {t('Menu')}
                </Text>
                <Image
                  onClick={onVisible}
                  src={'/images/ic-close.png'}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                  alt=""
                />
              </div>

              <div className="flex flex-col gap-4 py-6 px-4">
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
            </div>
          </DrawerBody>
        </>
      </DrawerContent>
    </Drawer>
  );
};
export default forwardRef(DrawerMenu);

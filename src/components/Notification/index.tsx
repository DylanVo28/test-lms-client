import { useTranslation } from 'next-i18next';
import Text from '../UI/Text';
import { Tab, Tabs } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import ListNotification from './ListNotification';
import { useNotifications } from '@/store/notification/useNotification';
import { useMount } from 'ahooks';
import clsx from 'clsx';
import { useTheme } from '@/store/theme/useTheme';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useAccount } from 'wagmi';

export enum TAB_NOTIFICATION {
  VIEW_ALL = 'VIEW_ALL',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
}

const Notification = ({ isOpen }: { isOpen: boolean }) => {
  const { t, i18n } = useTranslation('common');
  const [tab, setTab] = useState(TAB_NOTIFICATION.VIEW_ALL);
  const token = useAccessToken();

  // const findLang = (code: string) => {
  //   return languages.find((lang) => lang.code === code)?.name || '';
  // };

  const onChangeTab = (tab: any) => {
    const params = {
      page: 1,
      pageSize: 50,
      userType: tab === TAB_NOTIFICATION?.VIEW_ALL ? '' : tab,
      lang: i18n.language,
    };
    requestGetNotification.run(params);

    setTab(tab);
  };

  const {
    requestReadNotification,
    notifications,
    requestCheckHasNotification,
    loading,
    requestGetNotification,
  } = useNotifications();

  useEffect(() => {
    if (token && isOpen) {
      const params = {
        page: 1,
        pageSize: 50,
        lang: i18n.language,
      };
      requestCheckHasNotification?.run();
      requestGetNotification.run(params);
    }
  }, [token, isOpen, notifications]);

  const DATA_TAB_NOTIFICATION = [
    {
      id: TAB_NOTIFICATION.VIEW_ALL,
      lable: t('View All'),
    },
    {
      id: TAB_NOTIFICATION.INSTRUCTOR,
      lable: t('Instructor'),
    },
    {
      id: TAB_NOTIFICATION.STUDENT,
      lable: t('Student'),
    },
  ];

  const handleReadNotification = (item: any) => {
    if (item?.read) {
      return;
    }
    requestReadNotification.run(item?.id);
  };

  return (
    <div className="flex p-4 w-full md:min-w-[552px] flex-col gap-5">
      <div className="flex items-center gap-2">
        <Text type="font-18-600" className="text-white">
          {t('Notification')}
        </Text>
        {notifications?.totalCount > 0 && (
          <div
            className={clsx(
              ' bg-error rounded-full h-[18px] w-[18px] flex justify-center items-center',
              {
                ['!min-w-8']: notifications?.totalCount > 99,
              }
            )}
          >
            <Text type="font-12-500" className="text-white">
              {notifications?.totalCount > 99
                ? '99+'
                : notifications?.totalCount}
            </Text>
          </div>
        )}
      </div>
      <Tabs
        onSelectionChange={onChangeTab}
        selectedKey={tab}
        classNames={{
          tabList: 'w-full',
          tab: ['h-[40px] !border-0 shadow-none'],
          cursor: '!bg-main',
          tabContent: [
            'text-[16px] group-data-[selected=true]:text-text-white group-data-[selected=true]:font-semibold',
          ],
        }}
        variant={'bordered'}
      >
        {DATA_TAB_NOTIFICATION?.map((item) => {
          return <Tab key={item?.id} title={item?.lable} />;
        })}
      </Tabs>

      <ListNotification
        handleReadNotification={handleReadNotification}
        listNotification={notifications?.content}
        loading={loading}
      />
    </div>
  );
};
export default Notification;

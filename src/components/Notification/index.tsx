import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useNotifications } from '@/store/notification/useNotification';
import { Tab, Tabs } from '@nextui-org/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Text from '../UI/Text';
import ListNotification from './ListNotification';

export enum TAB_NOTIFICATION {
  VIEW_ALL = 'VIEW_ALL',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
}

const Notification = ({ isOpen }: { isOpen: boolean }) => {
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
      };
      requestCheckHasNotification?.run();
      requestGetNotification.run(params);
    }
  }, [token, isOpen]);

  const DATA_TAB_NOTIFICATION = [
    {
      id: TAB_NOTIFICATION.VIEW_ALL,
      lable: 'View All',
    },
    {
      id: TAB_NOTIFICATION.INSTRUCTOR,
      lable: 'Instructor',
    },
    {
      id: TAB_NOTIFICATION.STUDENT,
      lable: 'Student',
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
        <Text type="font-18-600" className="text-letter">
          Notification
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
            <Text type="font-12-500" className="text-letter">
              {notifications?.totalCount > 99
                ? '99+'
                : notifications?.totalCount}
            </Text>
          </div>
        )}
      </div>
      {isOpen && (
        <>
          <Tabs
            onSelectionChange={onChangeTab}
            selectedKey={tab}
            classNames={{
              tabList: 'w-full',
              tab: ['h-[40px] !border-0 shadow-none'],
              cursor: '!bg-main',
              tabContent: ['text-[16px] text-letter'],
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
        </>
      )}
    </div>
  );
};
export default Notification;

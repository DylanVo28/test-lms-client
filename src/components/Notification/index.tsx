import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useNotifications } from '@/store/notification/useNotification';
import { Tab, Tabs } from '@nextui-org/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Text from '../UI/Text';
import ListNotification from './ListNotification';
import { getAllNotification } from '@/store/notification/useNotification';
import { useQueries } from '@tanstack/react-query';

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

  const onChangeTab = (nextTab: any) => {
    setTab(nextTab);
  };

  const {
    requestReadNotification,
    notifications,
    requestCheckHasNotification,
    loading,
    requestGetNotification,
    setNotifications,
  } = useNotifications();

  useEffect(() => {
    if (token && isOpen) {
      requestCheckHasNotification?.run();
    }
  }, [token, isOpen]);

  const queries = useQueries({
    queries: [
      {
        queryKey: ['notifications', TAB_NOTIFICATION.VIEW_ALL],
        queryFn: async () => {
          const res = await getAllNotification({ page: 1, pageSize: 50, userType: '' });
          return res?.data || [];
        },
        enabled: Boolean(token && isOpen),
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      {
        queryKey: ['notifications', TAB_NOTIFICATION.INSTRUCTOR],
        queryFn: async () => {
          const res = await getAllNotification({ page: 1, pageSize: 50, userType: TAB_NOTIFICATION.INSTRUCTOR });
          return res?.data || [];
        },
        enabled: Boolean(token && isOpen),
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      {
        queryKey: ['notifications', TAB_NOTIFICATION.STUDENT],
        queryFn: async () => {
          const res = await getAllNotification({ page: 1, pageSize: 50, userType: TAB_NOTIFICATION.STUDENT });
          return res?.data || [];
        },
        enabled: Boolean(token && isOpen),
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    ],
  });

  const listByTab = () => {
    if (tab === TAB_NOTIFICATION.VIEW_ALL) return (queries[0]?.data as any[]) || [];
    if (tab === TAB_NOTIFICATION.INSTRUCTOR) return (queries[1]?.data as any[]) || [];
    return (queries[2]?.data as any[]) || [];
  };

  const isLoadingTabs = queries.some((q) => q.isLoading || q.isFetching);

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
            listNotification={listByTab()}
            loading={loading || isLoadingTabs}
          />
        </>
      )}
    </div>
  );
};
export default Notification;

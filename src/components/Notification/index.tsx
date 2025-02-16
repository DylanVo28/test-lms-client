import { useTranslation } from 'next-i18next';
import Text from '../UI/Text';
import { Tab, Tabs } from '@nextui-org/react';
import { useState } from 'react';
import ListNotification from './ListNotification';

export enum TAB_NOTIFICATION {
  VIEW_ALL = 'VIEW_ALL',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
}

const Notification = () => {
  const { t } = useTranslation('common');
  const [tab, setTab] = useState(TAB_NOTIFICATION.VIEW_ALL);
  const onChangeTab = (tab: any) => {
    setTab(tab);
  };

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

  return (
    <div className="flex p-4 min-w-[552px] flex-col gap-5">
      <div className="flex items-center gap-2">
        <Text type="font-18-600" className="text-white">
          {t('Notification')}
        </Text>

        <div className="min-w-7 min-h-4 py-[2px] px-1 flex justify-center items-center max-h-4 rounded-2xl bg-error-1">
          <Text type="font-12-600" className="text-white">
            99+
          </Text>
        </div>
      </div>
      <Tabs
        onSelectionChange={onChangeTab}
        selectedKey={tab}
        classNames={{
          tabList: 'w-full',
          tab: ['h-[40px] !border-0 shadow-none'],
          cursor: '!bg-main',
          tabContent: ['text-[16px] group-data-[selected=true]: font-semibold'],
        }}
        variant={'bordered'}
      >
        {DATA_TAB_NOTIFICATION?.map((item) => {
          return <Tab key={item?.id} title={item?.lable} />;
        })}
      </Tabs>

      {tab === TAB_NOTIFICATION.VIEW_ALL && <ListNotification />}
    </div>
  );
};
export default Notification;

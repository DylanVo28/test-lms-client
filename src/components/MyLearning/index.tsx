import React, { useEffect, useState } from 'react';
import Text from '../UI/Text';
import ListCourses from './ListCourses';
import { Tab, Tabs } from '@nextui-org/react';
import Wishlist from './Wishlist';
import { useRouter } from 'next/router';
import Certifications from './Certifications';
import FollowMentors from './FollowMentors';

export const enum TabMyLearning {
  COURSE_PROGRESS = 'COURSE_PROGRESS',
  WISHLIST = 'WISHLIST',
  CERTIFICATIONS = 'CERTIFICATIONS',
  FOLLOW_MENTORS = 'FOLLOW_MENTORS',
}

export default function MyLearning() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TabMyLearning.COURSE_PROGRESS);
  const itemsTab = [
    {
      key: TabMyLearning.COURSE_PROGRESS,
      label: 'Course Progress',
      children: <ListCourses />,
    },
    {
      key: TabMyLearning.CERTIFICATIONS,
      label: 'Certifications',
      children: <Certifications />,
    },
    {
      key: TabMyLearning.WISHLIST,
      label: 'Wish List',
      children: <Wishlist />,
    },
    {
      key: TabMyLearning.FOLLOW_MENTORS,
      label: 'Follow Mentors',
      children: <FollowMentors />,
    },
  ];
  const handleChangeTab = (tab: any) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (router.query.type === TabMyLearning.WISHLIST) {
      setActiveTab(TabMyLearning.WISHLIST);
    } else {
      setActiveTab(TabMyLearning.COURSE_PROGRESS);
    }
  }, [router.query.type]);

  return (
    <div className="flex flex-col gap-[40px]">
      <div className="pl-5 border-l-4 border-l-main">
        <Text type="font-28-700">My Learning</Text>
      </div>

      {/* <div className="border-b-[1px] border-[#2B3032] relative flex pb-[20px]">
        <div className="w-[150px]">
          <Text type="font-16-600" className="text-[var(--main-color)] text-center">
            Course Progress
          </Text>
        </div>
        <div className="absolute bottom-0 h-[3px] w-[150px] bg-[var(--main-color)]" />
      </div> */}

      <Tabs
        aria-label="Options"
        selectedKey={activeTab}
        onSelectionChange={handleChangeTab}
        classNames={{
          tabList:
            'gap-8 w-full relative rounded-none p-0 border-b border-[#2B3032]',
          cursor: 'w-full bg-main',
          tab: 'max-w-fit px-0 h-12',
          tabContent:
            'text-[16px] font-semibold text-white/80 group-data-[selected=true]:text-main pt-0',
          panel: '!p-0',
        }}
        color="primary"
        variant="underlined"
      >
        {itemsTab?.map((item: any) => {
          return (
            <Tab key={item?.key} className="py-6" title={item?.label}>
              {item?.children && item?.children}
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Text from '../UI/Text';
import ListCourses from './ListCourses';
import Wishlist from './Wishlist';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Certifications from './Certifications';
export const enum TabMyLearning {
  COURSE_PROGRESS = 'COURSE_PROGRESS',
  WISHLIST = 'WISHLIST',
  CERTIFICATIONS = 'CERTIFICATIONS',
  FOLLOW_MENTORS = 'FOLLOW_MENTORS',
}

export default function MyLearning() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TabMyLearning.COURSE_PROGRESS);

  const itemsTab = [
    {
      key: TabMyLearning.COURSE_PROGRESS,
      label: t('myLearning.tabs.courseProgress')
    },
    {
      key: TabMyLearning.CERTIFICATIONS,
      label: t('myLearning.tabs.certifications')
    },
    {
      key: TabMyLearning.WISHLIST,
      label: t('myLearning.tabs.wishlist')
    }
  ];

  const handleChangeTab = (tab: TabMyLearning) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (router.query.type === TabMyLearning.WISHLIST) {
      setActiveTab(TabMyLearning.WISHLIST);
    } else {
      setActiveTab(TabMyLearning.COURSE_PROGRESS);
    }
  }, [router.query.type]);

  // React Query sẽ cache dữ liệu; panes có thể unmount/remount an toàn

  return (
    <div className="flex flex-col gap-[40px]">
      <div className="pl-5 border-l-4 border-l-main">
        <Text type="font-28-700" className="text-letter">
          {t('myLearning.title')}
        </Text>
      </div>

      {/* Custom Tabs header */}
      <div className="flex gap-8 w-full border-b border-black-10 mb-6">
        {itemsTab.map((item) => (
          <button
            key={item.key}
            onClick={() => handleChangeTab(item.key as TabMyLearning)}
            className={
              `text-[16px] font-semibold pt-0 pb-3 px-1 transition-all border-b-2 ` +
              (activeTab === item.key
                ? 'text-main border-main'
                : 'text-gray-30 border-transparent') +
              ' focus:outline-none bg-transparent'
            }
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab panes - render theo tab, rely on React Query cache for data */}
      <div className="w-full">
        {activeTab === TabMyLearning.COURSE_PROGRESS && <ListCourses />}
        {activeTab === TabMyLearning.CERTIFICATIONS && <Certifications />}
        {activeTab === TabMyLearning.WISHLIST && <Wishlist />}
      </div>
    </div>
  );
}
import Notification from '@/components/Notification';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import Text from '@/components/UI/Text';
import MainLayout from '@/layout/MainLayout';
import { DefaultData } from '@/utils/const';
import { useRouter } from 'next/router';
import React from 'react';

const NotificationsPage: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <SEO
        title="Notifications"
        description="View all your notifications"
        imageUrl={DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <MainLayout>
          <div className="min-h-screen bg-gray-900">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 min-h-screen">
                <div className="px-0">
                  <Notification isOpen={true} />
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </AppProvider>
    </>
  );
};

export default NotificationsPage;

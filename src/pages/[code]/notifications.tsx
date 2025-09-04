import Notification from '@/components/Notification';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import Text from '@/components/UI/Text';
import MainLayout from '@/layout/MainLayout';
import { DefaultData } from '@/utils/const';
import { useRouter } from 'next/router';
import React from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const NotificationsPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <SEO
        title={t('notifications.title')}
        description={t('notifications.description')}
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

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  if (!params?.code) {
    return { notFound: true };
  }

  return {
    props: {
      code: params.code as string,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default NotificationsPage;

import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import MyLearning from '@/components/MyLearning';
import { GetServerSideProps } from 'next';
import SEO from '@/components/SEO';
import AppProvider from '@/components/Provider/AppProvider';
import { DefaultData } from '@/utils/const';

const MyLearningPage = () => {
  return (
    <>
      <MyLearning />
    </>
  );
};

MyLearningPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <SEO
        title="My Learning | What Exchange"
        description="View your learning progress and enrolled courses on What Exchange."
        imageUrl={DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <MainLayout>
          <>{page}</>
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
export default MyLearningPage;

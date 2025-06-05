import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import MyLearning from '@/components/MyLearning';

const MyLearningPage = () => {
  return (
    <>
      <Head>
        <title>My Learning | What Exchange</title>
        <meta
          name="description"
          content="View your learning progress and enrolled courses on What Exchange."
        />
      </Head>
      <MyLearning />
    </>
  );
};

MyLearningPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <>{page}</>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default MyLearningPage;

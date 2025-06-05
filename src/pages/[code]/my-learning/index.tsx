import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import MyLearning from '@/components/MyLearning';
import { GetServerSideProps } from 'next';

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

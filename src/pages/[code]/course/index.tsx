import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import Course from '@/components/Course';
import { GetServerSideProps } from 'next';

const CoursePage = () => {
  return (
    <>
      <Head>
        <title>Courses | What Exchange</title>
        <meta
          name="description"
          content="Explore all courses available on What Exchange."
        />
      </Head>
      <Course />
    </>
  );
};

CoursePage.getLayout = function getLayout(page: ReactElement) {
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

export default CoursePage;

import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';

const DetailCourse = dynamic(() => import('@/components/Course/DetailCourse'), {
  ssr: false,
});

const DetailCoursePage = () => {
  return (
    <>
      <Head>
        <title>Course Detail | What Exchange</title>
        <meta
          name="description"
          content="View detailed information about this course on What Exchange."
        />
      </Head>
      <DetailCourse />
    </>
  );
};

DetailCoursePage.getLayout = function getLayout(page: ReactElement) {
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
export default DetailCoursePage;

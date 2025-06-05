import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import dynamic from 'next/dynamic';

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

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }, // will be passed to the page component as props
  };
}

export default DetailCoursePage;

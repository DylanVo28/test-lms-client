import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import Course from '@/components/Course';

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

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default CoursePage;

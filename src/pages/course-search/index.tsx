import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import CourseSearch from '@/components/CourseSearch';

const CourseSearchPage = () => {
  return (
    <>
      <Head>
        <title>Course Search | What Exchange</title>
        <meta
          name="description"
          content="Search for courses on What Exchange."
        />
      </Head>
      <CourseSearch />
    </>
  );
};

CourseSearchPage.getLayout = function getLayout(page: ReactElement) {
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

export default CourseSearchPage;

import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import CourseSearch from '@/components/CourseSearch';
import { GetServerSideProps } from 'next';

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

export default CourseSearchPage;

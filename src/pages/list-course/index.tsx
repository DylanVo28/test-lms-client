import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import ListCourse from '@/components/ListCourse';

const ListCoursePage = () => {
  return (
    <>
      <Head>
        <title>List Courses | What Exchange</title>
        <meta
          name="description"
          content="Browse all available courses on What Exchange."
        />
      </Head>
      <ListCourse />
    </>
  );
};

ListCoursePage.getLayout = function getLayout(page: ReactElement) {
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

export default ListCoursePage;

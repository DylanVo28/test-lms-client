import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import ListCourse from '@/components/ListCourse';
import { GetServerSideProps } from 'next';

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

export default ListCoursePage;

import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import ListCourse from '@/components/ListCourse';
import { GetServerSideProps } from 'next';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import { DefaultData } from '@/utils/const';

const ListCoursePage = () => {
  return (
    <>
      <ListCourse />
    </>
  );
};

ListCoursePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <SEO
        title="List Courses | What Exchange"
        description="Browse all available courses on What Exchange."
        imageUrl={DefaultData.DefaultCourseImage}
      ></SEO>
      <AppProvider>
        <MainLayout>
          <>{page}</>
        </MainLayout>
      </AppProvider>
    </>
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

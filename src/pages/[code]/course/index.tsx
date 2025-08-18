import { ReactElement } from 'react';
import Head from 'next/head';

import MainLayout from '@/layout/MainLayout';
import Course from '@/components/Course';
import { GetServerSideProps } from 'next';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import { DefaultData } from '@/utils/const';

const CoursePage = () => {
  return (
    <>
      <Course />
    </>
  );
};

CoursePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <SEO
        title="Courses | What Exchange"
        description="Explore all courses available on What Exchange."
        imageUrl={DefaultData.DefaultCourseImage}
      />
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
    },
  };
};

export default CoursePage;

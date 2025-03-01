import { ReactElement } from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import Course from '@/components/Course';
import { GetServerSideProps } from 'next';

const CoursePage = () => {
  return <Course />;
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

import { ReactElement } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
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
  const LayoutWrapper = () => {
    const { t } = useTranslation('common');
    return (
      <>
        <SEO
          title={t('listCourse.pageTitle')}
          description={t('listCourse.pageDescription')}
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
  return <LayoutWrapper />;
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

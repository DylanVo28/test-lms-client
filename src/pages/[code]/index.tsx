import { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import Course from '@/components/Course';
import { GetServerSideProps } from 'next';
import { getAccessToken } from '@/store/auth';
import LandingPage from '@/components/Landingpage';
import Head from 'next/head';
import SEO from '@/components/SEO';
import { DefaultData } from '@/utils/const';
import AppProvider from '@/components/Provider/AppProvider';

type Props = {
  code: string;
};

const HomePage = ({ code }: Props) => {
  return (
    <>
      <Course />
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

HomePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <SEO
        title="Home | What Exchange"
        description="Welcome to the What Exchange homepage."
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

export default HomePage;

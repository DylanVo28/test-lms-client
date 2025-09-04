import { ReactElement, Fragment } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import Course from '@/components/Course';
import MainLayout from '@/layout/MainLayout';
import LandingPage from '@/components/Landingpage';
import { NextSeo } from 'next-seo';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import { DefaultData } from '@/utils/const';

function getLayout(page: ReactElement) {
  const LayoutWrapper = () => {
    const router = useRouter();

    if (router.pathname === '/') {
      return <Fragment>{page}</Fragment>;
    }
    return <MainLayout>{page}</MainLayout>;
  };
  return <LayoutWrapper />;
}

const HomePage = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <SEO
        title={t('seo.homeTitle')}
        description={t('seo.homeDescription')}
        imageUrl={DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <LandingPage />
      </AppProvider>
    </>
  );
};

HomePage.getLayout = getLayout;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default HomePage;

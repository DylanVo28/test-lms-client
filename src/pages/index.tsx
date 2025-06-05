import { ReactElement, Fragment } from 'react';
import { useRouter } from 'next/router';

import Course from '@/components/Course';
import MainLayout from '@/layout/MainLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LandingPage from '@/components/Landingpage';

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
  return <LandingPage />;
};

HomePage.getLayout = getLayout;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default HomePage;

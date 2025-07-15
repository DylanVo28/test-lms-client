import { ReactElement, Fragment } from 'react';
import { useRouter } from 'next/router';

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
  return (
    <>
      <SEO
        title="What Exchange | Home"
        description="Welcome to What Exchange, your platform for learning and sharing knowledge."
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
      // Will be passed to the page component as props
    },
  };
}

export default HomePage;

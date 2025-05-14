import { ReactElement } from 'react';

import Course from '@/components/Course';
import MainLayout from '@/layout/MainLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const HomePage = () => {
  return <Course />;
};

HomePage.getLayout = function getLayout(page: ReactElement) {
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

export default HomePage;

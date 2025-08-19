import { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { GetServerSideProps } from 'next';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import { DefaultData } from '@/utils/const';
import dynamic from 'next/dynamic';

const MainLayout = dynamic(() => import('@/layout/MainLayout'), {
  ssr: false,
});

const CourseSearch = dynamic(() => import('@/components/CourseSearch'), {
  ssr: false,
});

const CourseSearchPage = () => {
  return (
    <>
      <CourseSearch />
    </>
  );
};

CourseSearchPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <SEO
        title="Course Search | What Exchange"
        description="Search for courses on What Exchange."
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
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default CourseSearchPage;

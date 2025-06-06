import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Lesson from '@/components/Lesson';
import LessonLayout from '@/layout/LessonLayout';
import { GetServerSideProps } from 'next';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import { DefaultData } from '@/utils/const';

const LessonPage = () => {
  return (
    <>
      <Lesson />
    </>
  );
};

LessonPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <SEO
        title="Lessons | What Exchange"
        description="Browse all lessons available on What Exchange."
        imageUrl={DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <LessonLayout>
          <>{page}</>
        </LessonLayout>
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
export default LessonPage;

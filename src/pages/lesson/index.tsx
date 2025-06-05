import { ReactElement } from 'react';
import Head from 'next/head';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Lesson from '@/components/Lesson';
import LessonLayout from '@/layout/LessonLayout';

const LessonPage = () => {
  return (
    <>
      <Head>
        <title>Lessons | What Exchange</title>
        <meta
          name="description"
          content="Browse all lessons available on What Exchange."
        />
      </Head>
      <Lesson />
    </>
  );
};

LessonPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LessonLayout>
      <>{page}</>
    </LessonLayout>
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

export default LessonPage;

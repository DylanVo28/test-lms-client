import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Lesson from '@/components/Lesson';
import LessonLayout from '@/layout/LessonLayout';
import { ReactElement, useEffect } from 'react';
import Head from 'next/head';

const DetailLessonPage = () => {
  return (
    <>
      <Head>
        <title>Lesson Detail | What Exchange</title>
        <meta
          name="description"
          content="View detailed information about this lesson on What Exchange."
        />
      </Head>
      <Lesson />
    </>
  );
};

DetailLessonPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LessonLayout>
      <>{page}</>
    </LessonLayout>
  );
};

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }, // will be passed to the page component as props
  };
}

export default DetailLessonPage;

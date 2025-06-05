import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Lesson from '@/components/Lesson';
import LessonLayout from '@/layout/LessonLayout';
import { ReactElement, useEffect } from 'react';
import { GetServerSideProps } from 'next';
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

export default DetailLessonPage;

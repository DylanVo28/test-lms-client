import { ReactElement } from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Lesson from '@/components/Lesson';
import LessonLayout from '@/layout/LessonLayout';
import { GetServerSideProps } from 'next';

const LessonPage = () => {
  return <Lesson />;
};

LessonPage.getLayout = function getLayout(page: ReactElement) {
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
export default LessonPage;

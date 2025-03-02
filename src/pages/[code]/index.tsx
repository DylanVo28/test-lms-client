import { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import Course from '@/components/Course';
import { GetServerSideProps } from 'next';

type Props = {
  code: string;
};

const HomePage = ({ code }: Props) => {
  return <Course />;
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

HomePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <>{page}</>
    </MainLayout>
  );
};

export default HomePage;

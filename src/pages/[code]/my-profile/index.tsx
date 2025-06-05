import MyProfile from '@/components/MyProfile';
import MainLayout from '@/layout/MainLayout';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { ReactElement } from 'react';
import Head from 'next/head';

const MyProfilePage = () => {
  return (
    <>
      <Head>
        <title>My Profile | What Exchange</title>
        <meta
          name="description"
          content="Manage your profile and account settings on What Exchange."
        />
      </Head>
      <MyProfile />
    </>
  );
};

MyProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
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

export default MyProfilePage;

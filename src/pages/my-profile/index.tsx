import MyProfile from '@/components/MyProfile';
import MainLayout from '@/layout/MainLayout';
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

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default MyProfilePage;

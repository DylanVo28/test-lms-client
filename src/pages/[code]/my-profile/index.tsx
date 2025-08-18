import MyProfile from '@/components/MyProfile';
import MainLayout from '@/layout/MainLayout';
import { GetServerSideProps } from 'next';
import React, { ReactElement } from 'react';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import { DefaultData } from '@/utils/const';

const MyProfilePage = () => {
  return (
    <>
      <MyProfile />
    </>
  );
};

MyProfilePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <SEO
        title="My Profile | What Exchange"
        description="Manage your profile and account settings on What Exchange."
        imageUrl={DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <MainLayout>{page}</MainLayout>
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
    },
  };
};

export default MyProfilePage;

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreateCourse from '@/components/CreateCourse';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import { DefaultData } from '@/utils/const';

const CreateCoursePage = () => {
  return (
    <>
      <SEO
        title="Create Course | What Exchange"
        description="Create a new course on What Exchange."
        imageUrl={DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <CreateCourse />
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

export default CreateCoursePage;

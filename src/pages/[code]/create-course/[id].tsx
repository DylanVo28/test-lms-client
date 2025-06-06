import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PlanYourCourse from '@/components/CreateCourse/PlanYourCourse';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import { DefaultData } from '@/utils/const';

const PlanYourCoursePage = () => {
  return (
    <>
      <SEO
        title="Plan Your Course | What Exchange"
        description="Plan your course details on What Exchange."
        imageUrl={DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <PlanYourCourse />
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

export default PlanYourCoursePage;

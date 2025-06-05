import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PlanYourCourse from '@/components/CreateCourse/PlanYourCourse';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

const PlanYourCoursePage = () => {
  return (
    <>
      <Head>
        <title>Plan Your Course | What Exchange</title>
        <meta
          name="description"
          content="Plan your course details on What Exchange."
        />
      </Head>
      <PlanYourCourse />
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

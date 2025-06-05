import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreateCourse from '@/components/CreateCourse';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

const CreateCoursePage = () => {
  return (
    <>
      <Head>
        <title>Create Course | What Exchange</title>
        <meta
          name="description"
          content="Create a new course on What Exchange."
        />
      </Head>
      <CreateCourse />
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

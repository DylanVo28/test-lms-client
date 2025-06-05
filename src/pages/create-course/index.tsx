import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreateCourse from '@/components/CreateCourse';
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

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default CreateCoursePage;

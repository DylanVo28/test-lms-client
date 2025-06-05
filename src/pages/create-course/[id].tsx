import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PlanYourCourse from '@/components/CreateCourse/PlanYourCourse';
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

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }, // will be passed to the page component as props
  };
}

export default PlanYourCoursePage;

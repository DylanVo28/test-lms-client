import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PlanYourCourse from '@/components/CreateCourse/PlanYourCourse';
import { GetServerSideProps } from 'next';

const PlanYourCoursePage = () => {
  return <PlanYourCourse />;
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

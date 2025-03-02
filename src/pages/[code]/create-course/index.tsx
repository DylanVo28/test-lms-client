import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreateCourse from '@/components/CreateCourse';
import { GetServerSideProps } from 'next';

const CreateCoursePage = () => {
  return <CreateCourse />;
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

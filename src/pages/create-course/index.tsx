import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreateCourse from '@/components/CreateCourse';

const CreateCoursePage = () => {
  return <CreateCourse />;
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

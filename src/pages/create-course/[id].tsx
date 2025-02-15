import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PlanYourCourse from '@/components/CreateCourse/PlanYourCourse';

const PlanYourCoursePage = () => {
  return <PlanYourCourse />;
};

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }, // will be passed to the page component as props
  };
}

export default PlanYourCoursePage;

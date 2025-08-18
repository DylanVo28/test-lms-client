import PlanYourCourse from '@/components/CreateCourse/PlanYourCourse';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import AuthLayout from '@/layout/MainLayout/AuthLayout';
import { DefaultData } from '@/utils/const';
import { GetServerSideProps } from 'next';
const PlanYourCoursePage = () => {
  return (
    <>
      <SEO
        title="Plan Your Course | What Exchange"
        description="Plan your course details on What Exchange."
        imageUrl={DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <AuthLayout roles={['ADMIN', 'KOL']}>
          <PlanYourCourse />
        </AuthLayout>
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
    },
  };
};

export default PlanYourCoursePage;

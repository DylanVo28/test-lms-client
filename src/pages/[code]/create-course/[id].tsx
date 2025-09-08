import PlanYourCourse from '@/components/CreateCourse/PlanYourCourse';
import CurriculumProvider from '@/components/CreateCourse/PlanYourCourse/PlanYourCourseRight/Curriculum/context';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import AuthLayout from '@/layout/MainLayout/AuthLayout';
import { DefaultData } from '@/utils/const';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const PlanYourCoursePage = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <SEO
        title={t('createCourse.planCourse.pageTitle')}
        description={t('createCourse.planCourse.pageDescription')}
        imageUrl={DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <AuthLayout roles={['ADMIN', 'KOL']}>
          <CurriculumProvider>
            <PlanYourCourse />
          </CurriculumProvider>
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
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default PlanYourCoursePage;

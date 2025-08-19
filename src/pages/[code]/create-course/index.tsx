import CreateCourse from '@/components/CreateCourse';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import { DefaultData } from '@/utils/const';
import AuthLayout from '@/layout/MainLayout/AuthLayout';

const CreateCoursePage = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <SEO
        title={t('createCourse.pageTitle')}
        description={t('createCourse.pageDescription')}
        imageUrl={DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <AuthLayout roles={['ADMIN', 'KOL']}>
          <CreateCourse />
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

export default CreateCoursePage;

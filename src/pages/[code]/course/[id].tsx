import MainLayout from '@/layout/MainLayout';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { privateRequest, request } from '@/api/request';
import { API_PATH } from '@/api/constant';
import { DefaultData } from '@/utils/const';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const DetailCourse = dynamic(() => import('@/components/Course/DetailCourse'), {
  ssr: false,
});

const DetailCoursePage = ({ courseMedadata }: any) => {
  return (
    <>
      <DetailCourse />
    </>
  );
};

const CourseLayoutWrapper = ({ courseMedadata }: any) => {
  const { t } = useTranslation('common');

  return (
    <>
      <SEO
        title={courseMedadata?.title || t('seo.courseDefaultTitle')}
        description={
          courseMedadata?.description || t('seo.courseDefaultDescription')
        }
        imageUrl={courseMedadata?.image || DefaultData.DefaultCourseImage}
      />
      <AppProvider>
        <MainLayout>
          <DetailCourse />
        </MainLayout>
      </AppProvider>
    </>
  );
};

DetailCoursePage.getLayout = function getLayout(page: any) {
  const courseMedadata = page?.props?.courseMedadata;

  return <CourseLayoutWrapper courseMedadata={courseMedadata} />;
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  if (!params?.code) {
    return { notFound: true };
  }

  // const courseRes = await privateRequest(
  //   request.get,
  //   API_PATH.COURSE_METADATA(params.id as string),
  //   {
  //     params: {
  //       courseId: params.id,
  //     },
  //   }
  // );
  //
  // const courseMedadata = courseRes?.data;

  return {
    props: {
      code: params.code as string,
      // courseMedadata,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};
export default DetailCoursePage;

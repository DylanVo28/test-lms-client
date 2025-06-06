import { ReactElement } from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { privateRequest, request } from '@/api/request';
import { API_PATH } from '@/api/constant';
import { DefaultData } from '@/utils/const';
import { NextSeo } from 'next-seo';
import AppProvider from '@/components/Provider/AppProvider';
import SEO from '@/components/SEO';

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

DetailCoursePage.getLayout = function getLayout(page: any) {
  const courseMedadata = page?.props?.courseMedadata;

  return (
    <>
      <SEO
        title={courseMedadata?.title || DefaultData.DefaultTitle}
        description={
          courseMedadata?.description || DefaultData.DefaultDescription
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

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  if (!params?.code) {
    return { notFound: true };
  }

  const courseRes = await privateRequest(
    request.get,
    API_PATH.COURSE_METADATA(params.id as string),
    {
      params: {
        courseId: params.id,
      },
    }
  );

  const courseMedadata = courseRes?.data;

  return {
    props: {
      code: params.code as string,
      courseMedadata,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};
export default DetailCoursePage;

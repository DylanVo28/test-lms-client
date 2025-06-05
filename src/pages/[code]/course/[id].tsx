import { ReactElement } from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layout/MainLayout';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { privateRequest, request } from '@/api/request';
import { API_PATH } from '@/api/constant';
import { DefaultData } from '@/utils/const';
import { NextSeo } from 'next-seo';

const DetailCourse = dynamic(() => import('@/components/Course/DetailCourse'), {
  ssr: false,
});

const DetailCoursePage = ({ courseMedadata }: any) => {
  return (
    <>
      <NextSeo
        title={courseMedadata?.title || DefaultData.DefaultTitle}
        description={
          courseMedadata?.description || DefaultData.DefaultDescription
        }
        openGraph={{
          images: [
            { url: courseMedadata?.image || DefaultData.DefaultCourseImage },
          ],
        }}
      />
      <div>123123123123</div>
      <DetailCourse />
    </>
  );
};

DetailCoursePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <>{page}</>
    </MainLayout>
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

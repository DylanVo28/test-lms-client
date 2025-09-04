import { ReactElement } from 'react';
import MainLayout from '@/layout/MainLayout';
import Course from '@/components/Course';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getAccessToken } from '@/store/auth';
import LandingPage from '@/components/Landingpage';
import Head from 'next/head';
import SEO from '@/components/SEO';
import { DefaultData } from '@/utils/const';
import AppProvider from '@/components/Provider/AppProvider';
import { useTranslation } from 'next-i18next';
import { ENV } from '@/utils/env';

type Props = {
  code: string;
};

const HomePage = ({ code }: Props) => {
  const { t } = useTranslation('common');
  return (
    <>
      <Course />
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

  try {
    const i18nProps = await serverSideTranslations(locale || 'en', ['common']);
    return {
      props: {
        code: params.code as string,
        ...i18nProps,
        _env: { APP_API_URL: ENV.APP_API_URL || null },
      },
    };
  } catch (e) {
    return {
      props: {
        code: params.code as string,
        _env: { APP_API_URL: ENV.APP_API_URL || null },
      },
    };
  }
};

HomePage.getLayout = function getLayout(page: ReactElement) {
  const LayoutWrapper = () => {
    const { t } = useTranslation('common');
    return (
      <>
        <SEO
          title={t('seo.homeAltTitle')}
          description={t('seo.homeAltDescription')}
          imageUrl={DefaultData.DefaultCourseImage}
        />
        <AppProvider>
          <MainLayout>
            <>{page}</>
          </MainLayout>
        </AppProvider>
      </>
    );
  };
  return <LayoutWrapper />;
};

export default HomePage;

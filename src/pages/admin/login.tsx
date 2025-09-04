import { ReactElement } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import Login from '@/components/Admin/Login';
import AuthLayout from '@/layout/AuthLayout';

const LoginPage = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Head>
        <title>{t('admin.loginTitle')}</title>
        <meta name="description" content={t('admin.loginDescription')} />
      </Head>
      <Login />
    </>
  );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout>
      <>{page}</>
    </AuthLayout>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}

export default LoginPage;

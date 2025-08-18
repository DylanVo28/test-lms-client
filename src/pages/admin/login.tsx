import { ReactElement } from 'react';
import Head from 'next/head';

import Login from '@/components/Admin/Login';
import AuthLayout from '@/layout/AuthLayout';

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Admin Login | What Exchange</title>
        <meta
          name="description"
          content="Admin login page for What Exchange platform."
        />
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

export default LoginPage;

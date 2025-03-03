import { ReactElement } from 'react';

import Login from '@/components/Admin/Login';
import AuthLayout from '@/layout/AuthLayout';

const LoginPage = () => {
  return <Login />;
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout>
      <>{page}</>
    </AuthLayout>
  );
};

export default LoginPage;

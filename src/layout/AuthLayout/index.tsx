import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}
const AuthLayout = (props: AuthLayoutProps) => {
  const { children } = props;
  return (
    <div className="w-full bg-primary h-screen overflow-auto grid grid-cols-1 lg:grid-cols-2 relative z-10 ">
      <div className="bg-[url('/bg-login.png')] hidden lg:block bg-center bg-no-repeat bg-[length:100%_100%] w-full h-full"></div>
      <div className="flex justify-center items-center relative">
        <div className="w-full lg:w-10/12">{children}</div>
      </div>
    </div>
  );
};
export default AuthLayout;

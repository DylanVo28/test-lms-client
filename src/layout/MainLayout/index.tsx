import { ReactNode } from 'react';
import MainHeader from './MainHeader';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { ROUTE_PATH } from '@/utils/const';
import useStorageOrCookieChange from '@/hooks/useStorageOrCookieChange';
import { getAccessToken } from '@/store/auth';
import LandingPage from '@/components/Landingpage';
import { useAccount } from 'wagmi';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  useStorageOrCookieChange();

  const accessToken = getAccessToken();
  const { address } = useAccount();

  console.log(address, accessToken, 'address::::');

  if (!accessToken || !address) {
    return <LandingPage />;
  }

  return (
    <div className="w-screen bg-[var(--theme-primary)] h-screen overflow-x-hidden overflow-auto flex flex-col relative">
      <MainHeader />
      <div
        className={clsx('w-full p-4 md:p-10', {
          ['!p-0 md:!p-10']: router.pathname === ROUTE_PATH.HOME,
        })}
      >
        <div className="max-w-[1440px] mx-auto">{children}</div>
      </div>
    </div>
  );
};
export default MainLayout;

import LandingPage from '@/components/Landingpage';
import useStorageOrCookieChange from '@/hooks/useStorageOrCookieChange';
import { getAccessToken } from '@/store/auth';
import { ROUTE_PATH } from '@/utils/const';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import MainHeader from './MainHeader';
import { useThemePreview } from '@/hooks/useThemePreview';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  useStorageOrCookieChange();
  useThemePreview(); // Initialize theme preview if in preview mode

  const accessToken = getAccessToken();
  const { address } = useAccount();

  if (!address || !accessToken) {
    return <LandingPage />;
  }

  return (
    <div className="w-screen bg-background h-screen overflow-x-hidden overflow-auto flex flex-col relative">
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

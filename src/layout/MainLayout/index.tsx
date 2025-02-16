import { ReactNode } from 'react';
import MainHeader from './MainHeader';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-screen bg-[var(--theme-primary)] h-screen overflow-x-hidden overflow-auto flex flex-col relative">
      <MainHeader />
      <div className="w-full p-4 md:p-10">
        <div className="max-w-[1440px] mx-auto">{children}</div>
      </div>
    </div>
  );
};
export default MainLayout;

import { ReactNode } from 'react';

const LoadingScreen = ({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: ReactNode;
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black-60 z-[9999] flex items-center justify-center">
          <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-main"></div>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;

import LandingPage from '@/components/Landingpage';
import RegisterFormModal from '@/components/RegisterFormModal';
import { getAccessToken } from '@/store/auth';
import { useProfile } from '@/store/profile/useProfile';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import Image from 'next/image';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

type ROLE = 'ADMIN' | 'KOL' | 'USER';
const AuthLayout = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: ROLE[];
}) => {
  const accessToken = getAccessToken();
  const { address } = useAccount();

  const { profile } = useProfile();

  const { requestGetProfile } = useProfileInitial();

  useEffect(() => {
    if (accessToken) {
      requestGetProfile();
    }
  }, [accessToken]);

  if (!address || !accessToken) {
    return <LandingPage />;
  }

  if (!roles.includes(profile?.role as ROLE)) {
    return (
      <div
        className="relative min-h-screen w-full h-[100vh]"
        style={{
          backgroundImage: "url('/images/landing-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute top-5 left-5 ">
          <Image
            alt="logo"
            className="cursor-pointer max-h-[50px] w-auto"
            src={'/logo.png'}
            width={150}
            height={56}
          />
        </div>

        <div className="w-full flex justify-center items-center flex-col gap-10 h-[80vh]">
          <div className="max-w-[800px] px-5 flex flex-col gap-5 justify-center items-center">
            <h1 className="text-[30px] text-main font-bold text-center">
              You are not authorized to access this page
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthLayout;

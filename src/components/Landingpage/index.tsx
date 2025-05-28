import ContentProfile from '@/layout/MainLayout/MainHeader/ContentProfile';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { useAccount, useDisconnect } from 'wagmi';
import RegisterFormModal from '../RegisterFormModal';
import Loading from '../UI/Loading';
import Text from '../UI/Text';

const LandingPage = () => {
  const { disconnect } = useDisconnect();

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
          width={125}
          height={46}
        />
      </div>

      <div className="w-full flex justify-center items-center flex-col gap-10 h-[80vh]">
        <div className="max-w-[800px] px-5 flex flex-col gap-5">
          <h1 className="text-[30px] text-main font-bold">
            Master Trading with Top KOLs – Learn from the Best
          </h1>

          <h5 className="text-[16px] text-white font-bold">
            Join our exclusive learning platform where top trading KOLs share
            their proven strategies and insights. From beginner basics to
            advanced techniques — learn at your own pace, anytime, anywhere.
          </h5>
        </div>
        <ConnectButton.Custom>
          {({ openConnectModal, mounted }) => {
            return (
              <>
                <Button
                  onPress={() => {
                    disconnect();
                    // sleep 0.5 seconds
                    setTimeout(() => {
                      disconnect();
                      openConnectModal();
                    }, 500);
                  }}
                  className="bg-main w-fit min-h-[40px] rounded"
                >
                  <Text className="text-white" type="font-16-600">
                    Connect Wallet
                  </Text>
                </Button>
              </>
            );
          }}
        </ConnectButton.Custom>
      </div>

      <RegisterFormModal />
    </div>
  );
};

export default LandingPage;

import { getAccessToken } from '@/store/auth';
import { Button } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { useEffect } from 'react';
import { useDisconnect } from 'wagmi';
import RegisterFormModal from '../RegisterFormModal';
import Text from '../UI/Text';
import { useTranslation } from 'next-i18next';
import ImageCustom from "@/components/UI/ImageCustom";

const LandingPage = () => {
  const { t } = useTranslation('common');
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
        <ImageCustom
          alt="logo"
          className="cursor-pointer max-h-[50px] w-auto"
          src={'/logo.png'}
          width={150}
          height={56}
          style={{
            aspectRatio: '1476 / 213'
          }}
        />
      </div>

      <div className="w-full flex justify-center items-center flex-col gap-10 h-[80vh]">
        <div className="max-w-[800px] px-5 flex flex-col gap-5 justify-center items-center">
          <h1 className="text-[30px] text-main font-bold text-center">
            {t('landing.headline')}
          </h1>

          <h5 className="text-[16px] text-letter font-bold text-center">
            {t('landing.subheadline')}
          </h5>
        </div>
        <ConnectButton.Custom>
          {({ openConnectModal, mounted }) => {
            return (
              <>
                <Button
                  onPress={() => {
                    openConnectModal();
                  }}
                  className="bg-main w-fit min-h-[40px] rounded"
                >
                  <Text className="text-letter" type="font-16-600">
                    {t('landing.connectWallet')}
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

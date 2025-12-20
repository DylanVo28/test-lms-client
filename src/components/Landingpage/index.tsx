import { Button } from '@nextui-org/react';
import RegisterFormModal from '../RegisterFormModal';
import Text from '../UI/Text';
import { useTranslation } from 'next-i18next';
import ImageCustom from '@/components/UI/ImageCustom';
import {useEffect, useRef, useState} from 'react';

const LandingPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation('common');
  const [direction, setDirection] = useState<1 | -1>(1); // 1: forward, -1: backward

  const reverseTimerRef = useRef<number | null>(null);
  const MAX_TIME = 6; // giới hạn 6s như yêu cầu
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    // Khi đang chạy tới và chạm 6s thì bắt đầu chạy ngược lại
    if (direction === 1 && video.currentTime >= MAX_TIME) {
      video.currentTime = MAX_TIME;
      startReverse();
      return;
    }
  };
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Bắt đầu phát từ 0 với tốc độ bình thường
    video.currentTime = 0;
    video.playbackRate = 1;
    video.play().catch(() => {
      // ignore autoplay block
    });

    return () => {
      // cleanup interval khi component unmount
      if (reverseTimerRef.current !== null) {
        window.clearInterval(reverseTimerRef.current);
      }
    };
  }, []);
  const startReverse = () => {
    const video = videoRef.current;
    if (!video) return;

    // Dừng phát bình thường, bắt đầu "tua ngược" bằng cách giảm currentTime
    video.pause();
    setDirection(-1);

    if (reverseTimerRef.current !== null) {
      window.clearInterval(reverseTimerRef.current);
    }

    const STEP = 0.03; // ~30ms * 1x speed
    reverseTimerRef.current = window.setInterval(() => {
      const v = videoRef.current;
      if (!v) return;

      if (v.currentTime <= 0.03) {
        // Kết thúc tua ngược, quay lại 0 và phát tới
        v.currentTime = 0;
        setDirection(1);
        window.clearInterval(reverseTimerRef.current!);
        reverseTimerRef.current = null;
        v.play();
      } else {
        v.currentTime = v.currentTime - STEP;
      }
    }, 30);
  };
  const handleConnectWallet = async () => {
    window.openModalPrivyConnect();
  };

  return (
    <div className="relative min-h-screen w-full h-[100vh] overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/media/background2.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}

      />
      {/* Overlay để đảm bảo content dễ đọc */}
      <div className="absolute inset-0 bg-black/20 z-[1]" />
      
      {/* Content */}
      <div className="relative z-[2] h-full">
        <div className="absolute top-5 left-5">
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
          <Button
            onPress={handleConnectWallet}
            className="bg-main w-fit min-h-[40px] rounded"
          >
            <Text className="text-letter" type="font-16-600">
              {t('landing.connectWallet')}
            </Text>
          </Button>
        </div>

        <RegisterFormModal />
      </div>
    </div>
  );
};

export default LandingPage;

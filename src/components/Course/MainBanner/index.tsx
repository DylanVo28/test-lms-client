import IconArrowRight from '@/components/UI/Icons/IconArrowRight';
import Text from '@/components/UI/Text';
import { useTheme } from '@/store/theme/useTheme';
import { Button } from '@nextui-org/react';
import House from '@/components/UI/Icons/House';
import Image from 'next/image';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'next-i18next';
import ImageCustom from "@/components/UI/ImageCustom";

const MainBanner = () => {
  const { theme } = useTheme();
  const { t } = useTranslation('common');
  const defaultTopics = t('banner.defaultTopics', {
    returnObjects: true,
  }) as string[];

  const bgImageSrc = isMobile
    ? '/bg-banner-mobile.png'
    : theme?.banner || '/images/bg-banner.png';

  return (
    <div className="relative w-full !bg-cover overflow-hidden !bg-center" style={{background: `url(${bgImageSrc})` , maxHeight: '400px'}}>
      {/* Background Image */}


      {/* Content */}
      <div className="relative z-1 items-center py-[20px] px-4 md:py-[40px] md:px-8 min-h-[400px] md:min-h-[410px]">
        <div className="flex flex-col gap-10 md:gap-[50px] w-full md:w-6/12">
          <div className="flex items-center gap-1">
            <Button isIconOnly variant="light" size="md">
              <House size={20} />
            </Button>
            <IconArrowRight />
            <Text type="font-14-500" className="text-letter">
              {t('navigation.courses')}
            </Text>
          </div>
          <div className="flex flex-col gap-[40px]">
            <div className="flex flex-col gap-2">
              <Text type="font-28-700" className="text-letter">
                {theme?.title || t('banner.defaultTitle')}
              </Text>
              <Text type="font-16-400" className="text-letter">
                {theme?.description || t('banner.defaultDescription')}
              </Text>
            </div>
            <div className="flex flex-col gap-3">
              <Text type="font-16-400" className="text-letter">
                {t('banner.topicsTitle')}
              </Text>
              {theme?.topics?.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3">
                  {theme?.topics?.map((item) => {
                    return (
                      <div
                        key={item}
                        className="rounded-full bg-card border-1 border-white-10 py-1 px-3 flex justify-center items-center"
                      >
                        <Text type="font-14-400" className="text-letter/70">
                          {item}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  {defaultTopics?.map((item) => {
                    return (
                      <div
                        key={item}
                        className="rounded-full bg-card border-1 border-white-10 py-1 px-3 flex justify-center items-center"
                      >
                        <Text type="font-14-400" className="text-letter/70">
                          {item}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile image at bottom */}
          <div className="block md:hidden w-full mb-[-40px]">
            <ImageCustom
              src="/images/bg-banner-mobile1.png"
              alt={t('banner.altMobileBanner')}
              width={343}
              height={230}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;

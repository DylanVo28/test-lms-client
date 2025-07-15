import IconArrowRight from '@/components/UI/Icons/IconArrowRight';
import Text from '@/components/UI/Text';
import { useTheme } from '@/store/theme/useTheme';
import { Button } from '@nextui-org/react';
import { House } from '@phosphor-icons/react';
import Image from 'next/image';
import { isMobile } from 'react-device-detect';

const DATA_SKILL = [
  'Design',
  'UX',
  'Java',
  'SEO',
  'Python',
  'Blockchain',
  'Digital Media',
];

const MainBanner = () => {
  const { theme } = useTheme();

  const bgImageSrc = isMobile
    ? '/bg-banner-mobile.png'
    : theme?.banner || '/images/bg-banner.png';

  return (
    <div className="relative w-full min-h-[400px]  md:min-h-[410px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src={bgImageSrc}
          alt="Banner background"
          fill
          priority
          sizes="100vw"
          className="rounded"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-1 items-center py-[20px] px-4 md:py-[40px] md:px-8 min-h-[400px] md:min-h-[410px]">
        <div className="flex flex-col gap-10 md:gap-[50px] w-full md:w-6/12">
          <div className="flex items-center gap-1">
            <Button isIconOnly variant="light" size="md">
              <House size={20} />
            </Button>
            <IconArrowRight />
            <Text type="font-14-500" className="text-white">
              {'Course'}
            </Text>
          </div>
          <div className="flex flex-col gap-[40px]">
            <div className="flex flex-col gap-2">
              <Text type="font-28-700" className="text-white">
                {theme?.title ? theme?.title : 'Web Development Courses'}
              </Text>
              <Text type="font-16-400" className="text-white">
                {theme?.description
                  ? theme?.description
                  : 'With one of our online web development courses, you can explore different areas of this in-demand field.'}
              </Text>
            </div>
            <div className="flex flex-col gap-3">
              <Text type="font-16-400" className="text-white">
                {'Topics related to Web Development'}
              </Text>
              {theme?.topics?.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3">
                  {theme?.topics?.map((item) => {
                    return (
                      <div
                        key={item}
                        className="rounded-full bg-white-10 border-1 border-white-10 py-1 px-3 flex justify-center items-center"
                      >
                        <Text type="font-14-400" className="text-black-7">
                          {item}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  {DATA_SKILL?.map((item) => {
                    return (
                      <div
                        key={item}
                        className="rounded-full bg-white-10 border-1 border-white-10 py-1 px-3 flex justify-center items-center"
                      >
                        <Text type="font-14-400" className="text-black-7">
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
            <Image
              src="/images/bg-banner-mobile1.png"
              alt=""
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

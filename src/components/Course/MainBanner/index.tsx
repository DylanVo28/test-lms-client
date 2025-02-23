import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import Image from 'next/image';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'next-i18next';
import IconHome from '@/components/UI/Icons/IconHome';
import IconArrowRight from '@/components/UI/Icons/IconArrowRight';

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
  const { t } = useTranslation('common');

  return (
    <div
      className={clsx(
        "w-full py-[20px] bg-transparent rounded-md md:py-[40px] md:px-8 min-h-[400px] md:min-h-[410px] bg-[url('/images/bg-banner.png')] bg-center bg-no-repeat bg-[length:100%_100%]",
        {
          ["bg-[url('/images/bg-banner-mobile.png')]"]: isMobile,
        }
      )}
    >
      <div className="flex flex-col gap-10 md:gap-[50px] w-full md:w-6/12">
        <div className="flex items-center gap-1">
          <Button isIconOnly variant="light" size="md">
            <IconHome />
          </Button>
          <IconArrowRight />
          <Text type="font-14-500" className="text-white">
            {t('Course')}
          </Text>
        </div>
        <div className="flex flex-col gap-[40px]">
          <div className="flex flex-col gap-2">
            <Text type="font-32-700" className="text-white">
              {t('Web Development Courses')}
            </Text>
            <Text type="font-16-400" className="text-white">
              {t(
                'With one of our online web development courses, you can explore different areas of this in-demand field.'
              )}
            </Text>
          </div>
          <div className="flex flex-col gap-3">
            <Text type="font-16-400" className="text-white">
              {t('Topics related to Web Development')}
            </Text>
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
          </div>
        </div>

        <Image
          src={'/images/bg-banner-mobile1.png'}
          alt=""
          width={343}
          height={230}
          className="w-full h-auto block mb-[-40px] md:hidden"
        />
      </div>
    </div>
  );
};

export default MainBanner;

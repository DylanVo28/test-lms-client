import Text from '@/components/UI/Text';
import { useTranslation } from 'next-i18next';
import { Button } from '@nextui-org/react';
import Image from 'next/image';

const About = ({ data }: { data: any }) => {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col gap-3 border-b-1 border-b-black-10 pb-5">
      <Text className="text-letter" type="font-20-600">
        {t('course.aboutThisCourse')}
      </Text>

      <div
        dangerouslySetInnerHTML={{ __html: data?.description }}
        className="text-[14px] font-normal text-letter"
      />
      {/* <Button variant="light" radius="full" className="hover:bg-main-20 w-max">
        <div className="flex items-center gap-[2px]">
          <Text type="font-14-500" className="text-main">
            See More
          </Text>
          <Image
            src={'/icons/ic-arrow-drop-right-line.svg'}
            width={20}
            height={20}
            alt=""
          />
        </div>
      </Button> */}
    </div>
  );
};
export default About;

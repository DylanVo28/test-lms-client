import IconArrowLeft from '@/components/UI/Icons/IconArrowLeft';
import IconArrowRight from '@/components/UI/Icons/IconArrowRight';
import IconHome from '@/components/UI/Icons/IconHome';
import Text from '@/components/UI/Text';
import { ROUTE_PATH } from '@/utils/const';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

const BreadCrumbs = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => router.push(ROUTE_PATH.COURSE)}
        isIconOnly
        variant="light"
        size="md"
      >
        <IconHome />
      </Button>
      <IconArrowRight />
      <Text
        type="font-14-500"
        onClick={() => router.push(ROUTE_PATH.COURSE)}
        className="text-white hover:opacity-80 cursor-pointer"
      >
        {t(`Course`)}
      </Text>

      <IconArrowRight />

      <Text type="font-14-500" className="text-main">
        {t('Course details')}
      </Text>
    </div>
  );
};
export default BreadCrumbs;

import IconArrowRight from '@/components/UI/Icons/IconArrowRight';
import Text from '@/components/UI/Text';
import useNavigate from '@/hooks/useNavigate';
import { ROUTE_PATH } from '@/utils/const';
import { Button } from '@nextui-org/react';
import { House } from '@phosphor-icons/react';

const BreadCrumbs = () => {
  const { navigate } = useNavigate();

  return (
    <div className="flex items-center gap-1">
      <Button
        onPress={() => navigate(ROUTE_PATH.COURSE)}
        isIconOnly
        variant="light"
        size="md"
      >
        <House size={20} />
      </Button>
      <IconArrowRight />
      <Text
        type="font-16-500"
        onClick={() => navigate(ROUTE_PATH.COURSE)}
        className="text-letter hover:opacity-80 cursor-pointer"
      >
        Course
      </Text>

      <IconArrowRight />

      <Text type="font-16-500" className="text-main">
        Course details
      </Text>
    </div>
  );
};
export default BreadCrumbs;

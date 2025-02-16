import Text from '@/components/UI/Text';
import { TYPE_COURSE } from '@/utils/const';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';

const FormSelectItem = ({
  handleClickItemAdd,
}: {
  handleClickItemAdd: (type: TYPE_COURSE) => void;
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="rounded-sm py-2 min-h-[36px] px-3 border-2 md:border-1 border-dashed border-white w-full flex items-center gap-2">
      <Button
        size="sm"
        variant="light"
        onPress={() => handleClickItemAdd(TYPE_COURSE.LECTURE)}
        className=" max-h-[24px] bg-transparent"
      >
        <div className="flex items-center gap-1">
          <IconPlusBlue />
          <Text type="font-14-500" className="text-[#0059FF]">
            {t('Lecture')}
          </Text>
        </div>
      </Button>
      <Button
        size="sm"
        variant="light"
        onPress={() => handleClickItemAdd(TYPE_COURSE.QUIZ)}
        className=" max-h-[24px] bg-transparent"
      >
        <div className="flex items-center gap-1">
          <IconPlusBlue />
          <Text type="font-14-500" className="text-[#0059FF]">
            {t('Quiz')}
          </Text>
        </div>
      </Button>
    </div>
  );
};

export default FormSelectItem;

const IconPlusBlue = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M9.16669 9.16699V4.16699H10.8334V9.16699H15.8334V10.8337H10.8334V15.8337H9.16669V10.8337H4.16669V9.16699H9.16669Z"
        fill="#0059FF"
      />
    </svg>
  );
};

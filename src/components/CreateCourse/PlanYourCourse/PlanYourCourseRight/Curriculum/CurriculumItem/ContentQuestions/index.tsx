import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'next-i18next';

const ContentQuestions = ({
  questions,
  handleClickEditQuestion,
  handleClickDeleteQuestion,
}: {
  handleClickEditQuestion: (values: any) => void;
  handleClickDeleteQuestion: (values: any) => void;
  questions: any;
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col justify-between p-3  border-1 border-t-0 border-white-15 gap-3">
      {questions?.map((item: any, index: number) => {
        return (
          <div className="flex justify-between items-center" key={index}>
            <div className="flex items-center gap-1">
              <Text type="font-14-700" className="text-white">
                {index + 1}.
              </Text>
              <div
                className="text-sm font-normal text-white/40"
                dangerouslySetInnerHTML={{ __html: item?.question }}
              />

              <Text type="font-14-400" className="text-white/40">
                {t('1 answer test')}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onPress={() => handleClickEditQuestion(item)}
                isIconOnly
                size="sm"
                radius="full"
                variant="light"
              >
                <PencilSimpleLine size={16} weight="light" />
              </Button>

              <Button
                onPress={() => handleClickDeleteQuestion(item)}
                isIconOnly
                size="sm"
                radius="full"
                variant="light"
              >
                <Trash size={16} weight="light" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ContentQuestions;

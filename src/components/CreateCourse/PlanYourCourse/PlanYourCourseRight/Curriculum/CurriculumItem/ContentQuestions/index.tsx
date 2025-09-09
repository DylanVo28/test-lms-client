import Text from '@/components/UI/Text';
import { Button, cn, Tooltip } from '@nextui-org/react';
import PencilSimpleLine from '@/components/UI/Icons/PencilSimpleLine';
import Trash from '@/components/UI/Icons/Trash';
import { useCurriculumContext } from '../../context';
import EditLessonToastContent from '@/components/Commons/EditLessonToast';
const ContentQuestions = ({
  questions,
  handleClickEditQuestion,
  handleClickDeleteQuestion,
}: {
  handleClickEditQuestion: (values: any) => void;
  handleClickDeleteQuestion: (values: any) => void;
  questions: any;
}) => {
  const { editLessonId } = useCurriculumContext();

  return (
    <div className="flex flex-col justify-between p-3  border-1 border-t-0 border-white-15 gap-3">
      {questions?.map((item: any, index: number) => {
        return (
          <div className="flex justify-between items-center" key={index}>
            <div className="flex items-start gap-2">
              <Text
                type="font-14-700"
                className="text-letter whitespace-nowrap"
              >
                Question {index + 1}:
              </Text>
              <div
                className="text-sm font-normal text-letter/40 line-clamp-2 mt-0.5 customContentEditor"
                dangerouslySetInnerHTML={{ __html: item?.question }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Tooltip content={editLessonId ? <EditLessonToastContent /> : ''}>
                <Button
                  onPress={() => {
                    if (!!editLessonId) return;
                    handleClickEditQuestion(item);
                  }}
                  isIconOnly
                  size="sm"
                  radius="full"
                  variant="light"
                  disabled={!!editLessonId}
                  className={cn(
                    !!editLessonId && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <PencilSimpleLine size={16} />
                </Button>
              </Tooltip>

              <Tooltip content={editLessonId ? <EditLessonToastContent /> : ''}>
                <Button
                  onPress={() => {
                    if (!!editLessonId) return;
                    handleClickDeleteQuestion(item);
                  }}
                  isIconOnly
                  size="sm"
                  radius="full"
                  variant="light"
                  disabled={!!editLessonId}
                  className={cn(
                    !!editLessonId && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Trash size={16} />
                </Button>
              </Tooltip>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ContentQuestions;

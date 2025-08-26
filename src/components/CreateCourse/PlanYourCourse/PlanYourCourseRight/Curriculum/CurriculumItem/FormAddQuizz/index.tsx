import Text from '@/components/UI/Text';
import {
  File,
  PlayCircle,
  QuestionMark,
} from '@/components/UI/Icons/FileIcons';
import { useEffect, useState } from 'react';
import FormAddQuestion from './FormAddQuestion';
const FormAddQuizz = ({
  handleSaveAddQuestion,
  loading,
  valueQuestion,
}: {
  handleSaveAddQuestion: (values: any, idEdit: string) => void;
  loading: boolean;
  valueQuestion: any;
}) => {
  const [isAddFormQuestion, setIsAddFormQuestion] = useState(false);

  const handleClickAddQuestion = () => {
    setIsAddFormQuestion(true);
  };
  useEffect(() => {
    if (valueQuestion?.question) {
      setIsAddFormQuestion(true);
    }
  }, [valueQuestion?.question]);

  return (
    <>
      {isAddFormQuestion ? (
        <FormAddQuestion
          loading={loading}
          valueQuestion={valueQuestion}
          handleSaveAddQuestion={(values) =>
            handleSaveAddQuestion(values, valueQuestion?.id)
          }
        />
      ) : (
        <div className="flex justify-center py-3 flex-col border-1 border-t-0 border-white-15 items-center gap-3">
          <div
            className="flex items-center gap-6"
            onClick={handleClickAddQuestion}
          >
            <div className="flex flex-col cursor-pointer items-center border-1 border-white-20 min-w-[70px]">
              <div className="border-b w-full items-center justify-center flex py-2 border-b-white-20">
                <QuestionMark size={32} color="#8C8C8C" weight="fill" />
              </div>

              <div className="p-2 bg-slate-600 w-full text-center">
                <Text>{'Multiple choice'}</Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormAddQuizz;

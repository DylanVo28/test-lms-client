import LoadingContainer from '@/components/UI/LoadingContainer';
import Text from '@/components/UI/Text';
import { Button, Radio, RadioGroup } from '@nextui-org/react';
import { CaretRight, CheckCircle, XCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import IsResult from './IsResult';
import { UserCourseProgressStatus } from '@/utils/common';

const enum STEP_ANSWER_QUESTION {
  SEE_RESULTS = 'SEE_RESULTS',
  CONTINUE = 'CONTINUE',
}

const FormStartTakingTest = ({
  dataQuizz,
  handleClickContinueQuizz,
}: {
  handleClickContinueQuizz: (id: string) => void;
  dataQuizz: any;
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answerCorrectly, setAnswerCorrectly] = useState<any>('');
  const [loading, setLoading] = useState(false);

  const [stepAnswerQuestion, setStepAnswerQuestion] = useState<string>('');

  useEffect(() => {
    if (dataQuizz?.progress?.status === UserCourseProgressStatus.COMPLETED) {
      setStepAnswerQuestion(STEP_ANSWER_QUESTION.CONTINUE);
    }
  }, [dataQuizz]);

  const [valueQuestion, setValueQuestion] = useState('');
  const onValueChange = (value: any) => {
    setValueQuestion(value);
  };

  const checkIsCorrectById = (id: string) => {
    const item = dataQuizz?.questions?.[currentQuestion - 1]?.answers?.find(
      (item: any) => item.id === id
    );
    return item ? item.isCorrect : false;
  };

  const handleCheckAnswer = () => {
    const isAnswers = checkIsCorrectById(valueQuestion);

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setAnswerCorrectly(isAnswers);
      if (currentQuestion === dataQuizz?.questions?.length && isAnswers) {
        setStepAnswerQuestion(STEP_ANSWER_QUESTION.SEE_RESULTS);
      }
    }, 500);
  };

  const handleNextQuestion = () => {
    if (
      currentQuestion <= dataQuizz?.questions?.length &&
      dataQuizz?.questions?.length > 1 &&
      answerCorrectly
    ) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswerCorrectly('');
    }
  };

  const handleSeeResult = () => {
    setLoading(true);
    setTimeout(() => {
      setStepAnswerQuestion(STEP_ANSWER_QUESTION.CONTINUE);

      setLoading(false);
    }, 500);
  };

  return (
    <div className="w-full flex flex-col min-h-[566px] relative">
      <LoadingContainer loading={loading} />
      {stepAnswerQuestion === STEP_ANSWER_QUESTION.CONTINUE ? (
        <IsResult
          questions={dataQuizz?.questions}
          totalQuizz={dataQuizz?.questions?.length}
          title={dataQuizz?.title}
        />
      ) : (
        <div className="w-6/12 pt-10 flex-1 mx-auto flex items-start text-start flex-col gap-4">
          {answerCorrectly === true && (
            <div className="p-4 flex items-center gap-3 w-full bg-transparent rounded-2xl border-1 border-green">
              <CheckCircle className="text-green" size={30} weight="fill" />
              <Text className="text-green" type="font-16-400">
                You did great
              </Text>
            </div>
          )}
          {answerCorrectly === false && (
            <div className="p-4 w-full bg-transparent flex items-center gap-3   rounded-2xl border-1 border-red-500">
              <XCircle size={30} weight="fill" className="text-red-500" />
              <Text className="text-red-500" type="font-16-400">
                The answer is not correct. Please try again.
              </Text>
            </div>
          )}

          <Text
            type="font-32-700"
            className="text-white"
          >{`Question ${currentQuestion}`}</Text>

          <div
            className="text-2xl text-white pb-4"
            dangerouslySetInnerHTML={{
              __html: dataQuizz?.questions?.[currentQuestion - 1]?.question,
            }}
          />
          <div className="w-full">
            <RadioGroup onValueChange={onValueChange}>
              {dataQuizz?.questions?.[currentQuestion - 1]?.answers?.map(
                (item: any) => {
                  return (
                    <CustomRadio key={item.id} value={item.id}>
                      <div
                        className="text-xl text-white font-semibold"
                        dangerouslySetInnerHTML={{
                          __html: item?.answer,
                        }}
                      />
                    </CustomRadio>
                  );
                }
              )}
            </RadioGroup>
          </div>
        </div>
      )}

      <div className="p-5 border-1 border-black-10 flex justify-between items-center border-l-0 border-r-0">
        <div className="w-[200px]">
          {dataQuizz?.progress?.status !==
            UserCourseProgressStatus.COMPLETED && (
            <Text
              type="font-16-400"
              className="text-white"
            >{`${currentQuestion}/${dataQuizz?.questions?.length}`}</Text>
          )}
        </div>

        {dataQuizz?.progress?.status === UserCourseProgressStatus.COMPLETED && (
          <Button
            onClick={() => handleClickContinueQuizz(dataQuizz?.id)}
            className="bg-main w-max  rounded min-w-[120px]"
          >
            <div className="flex items-center gap-2">
              <Text className="text-white" type="font-16-400">
                Continue
              </Text>
              <CaretRight size={16} weight="light" />
            </div>
          </Button>
        )}
        {stepAnswerQuestion === STEP_ANSWER_QUESTION.SEE_RESULTS && (
          <Button
            onClick={handleSeeResult}
            className="bg-main w-max  rounded min-w-[150px]"
          >
            <div className="flex items-center gap-2">
              <Text className="text-white" type="font-16-400">
                See results
              </Text>
              <CaretRight size={16} weight="light" />
            </div>
          </Button>
        )}
        {stepAnswerQuestion === STEP_ANSWER_QUESTION.CONTINUE &&
          answerCorrectly && (
            <Button
              onClick={() => {
                setStepAnswerQuestion('');
                setCurrentQuestion(1);
                setAnswerCorrectly('');
                handleClickContinueQuizz(dataQuizz?.id);
              }}
              className="bg-main w-max  rounded min-w-[100px]"
            >
              <div className="flex items-center gap-2">
                <Text className="text-white" type="font-16-400">
                  Continue
                </Text>
                <CaretRight size={16} weight="light" />
              </div>
            </Button>
          )}
        {!stepAnswerQuestion && (
          <>
            {answerCorrectly &&
            currentQuestion < dataQuizz?.questions?.length ? (
              <Button
                className="bg-main w-max  rounded min-w-[80px]"
                onClick={handleNextQuestion}
              >
                <div className="flex items-center gap-2">
                  <Text className="text-white" type="font-16-400">
                    Next
                  </Text>
                  <CaretRight size={16} weight="light" />
                </div>
              </Button>
            ) : (
              <Button
                isDisabled={!valueQuestion}
                onClick={() => handleCheckAnswer()}
                className="bg-main w-max  rounded min-w-[150px]"
              >
                <Text className="text-white" type="font-16-400">
                  Check the answer
                </Text>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default FormStartTakingTest;

export const CustomRadio = (props: any) => {
  const { children, value, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      size="md"
      value={value}
      classNames={{
        base: clsx(
          'inline-flex min-w-full m-0 bg-white/5 hover:bg-white/10 text-start items-centers',
          'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary'
        ),
        control: 'bg-white',
        wrapper:
          '!border-1 !border-black-7 group-data-[selected=true]:!bg-main group-data-[selected=true]:!border-main',
      }}
    >
      {children}
    </Radio>
  );
};

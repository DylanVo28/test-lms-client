import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import FormStartTakingTest from './FormStartTakingTest';
import LoadingContainer from '@/components/UI/LoadingContainer';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { TYPE_COURSE } from '@/utils/const';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'next-i18next';
import { reviewedAtom } from '..';
import { useAtom } from 'jotai';

const FormQuizz = ({
  startTakingTest,
  handleStartTakingTheTest,
  dataQuizz,
  handleClickContinueQuizz,
  handleProgressStatusQuizz,
  handleSkipQuizz,
  loading,
  handleFindIdNextChildSection,
  handleNextLastSection,
  handleFindIdPrevChildSection,
  handleNextChildSection,
  allItems,
  handlePrevChildSection,
}: {
  startTakingTest: any;
  handleNextLastSection: (id: string, type: string) => void;
  handleStartTakingTheTest: VoidFunction;
  handleClickContinueQuizz: (id: string) => void;
  handleProgressStatusQuizz: (id: string) => void;
  loading: boolean;
  dataQuizz: any;
  handleSkipQuizz: any;
  allItems: any;
  handleNextChildSection: (
    type: string,
    idNext: string,
    idCurrent: string,
    typeCurrent: string,
    contentType: string
  ) => void;
  handlePrevChildSection: (
    type: string,
    idNext: string,
    idCurrent: string,
    typeCurrent: string
  ) => void;

  handleFindIdNextChildSection: any;
  handleFindIdPrevChildSection: any;
}) => {
  const { t } = useTranslation('common');
  const sttQuizz = localStorage.getItem('titleQuizz');
  const dataItemNext = handleFindIdNextChildSection(dataQuizz?.id);
  const dataItemPrev = handleFindIdPrevChildSection(dataQuizz?.id);
  const lastIndex = allItems.findIndex(
    (item: any) => item?.id === dataQuizz?.id
  );
  const [reviewed] = useAtom(reviewedAtom);

  return (
    <div className="relative group">
      {dataItemPrev?.id && !isMobile && (
        <Button
          className="absolute group-hover:opacity-100 opacity-0 left-0 bg-main border-1 border-white-50 min-h-[50px] z-[1000] top-1/2 -translate-y-1/2"
          isIconOnly
          onClick={() => {
            handlePrevChildSection(
              dataItemPrev?.type,
              dataItemPrev?.id,
              dataQuizz?.id,
              TYPE_COURSE.QUIZ
            );
          }}
          size="sm"
          radius="sm"
        >
          <CaretLeft size={24} className="fill-text-white" />
        </Button>
      )}

      <LoadingContainer loading={loading} />

      {startTakingTest ? (
        <FormStartTakingTest
          isLast={!dataItemNext}
          reviewed={reviewed}
          handleProgressStatusQuizz={handleProgressStatusQuizz}
          handleClickContinueQuizz={(id) => {
            if (lastIndex === allItems?.length - 1) {
              handleNextLastSection(dataQuizz?.id, TYPE_COURSE.QUIZ);
            } else {
              handleNextChildSection(
                dataItemNext?.type,
                dataItemNext?.id,
                dataQuizz?.id,
                TYPE_COURSE.QUIZ,
                dataItemNext?.contentType
              );
              handleClickContinueQuizz(id);
            }
          }}
          dataQuizz={dataQuizz}
        />
      ) : (
        <div className="w-full min-h-[400px] md:min-h-[566px] pt-20 md:p-12">
          <div className="md:w-8/12 mx-auto flex items-start text-start flex-col gap-6">
            <Text className="text-white" type="font-28-700">
              {dataQuizz?.title}
            </Text>
            <div className="flex items-center gap-3">
              <Text className="text-black-6" type="font-18-600">
                {sttQuizz}
              </Text>
              <div className="w-[1px] h-4 bg-black-6" />
              <Text className="text-black-6" type="font-18-600">
                {`${dataQuizz?.questions?.length} ${t('question')}`}
              </Text>
            </div>
            <div
              className="text-white"
              dangerouslySetInnerHTML={{ __html: dataQuizz?.description }}
            />

            <div className="flex items-center gap-3">
              <Button
                onPress={handleStartTakingTheTest}
                className="bg-main w-max min-h-[45px] rounded min-w-[200px]"
              >
                <Text className="text-text-white" type="font-16-400">
                  {t('Start taking the test')}
                </Text>
              </Button>
              <Button
                onPress={() => handleSkipQuizz(dataQuizz?.id)}
                variant="light"
                className="w-max min-h-[45px] rounded min-w-[150px]"
              >
                <Text className="text-white" type="font-16-400">
                  {t('Skip the quizz')}
                </Text>
              </Button>
            </div>
          </div>
        </div>
      )}
      {!isMobile && !reviewed && (
        <Button
          className="absolute right-0 group-hover:opacity-100 opacity-0 bg-main border-1 border-white-50 min-h-[50px] z-[1000] top-1/2 -translate-y-1/2"
          isIconOnly
          size="sm"
          onPress={() => {
            if (lastIndex === allItems?.length - 1) {
              handleNextLastSection(dataQuizz?.id, TYPE_COURSE.QUIZ);
            } else {
              handleNextChildSection(
                dataItemNext?.type,
                dataItemNext?.id,
                dataQuizz?.id,
                TYPE_COURSE.QUIZ,
                dataItemNext?.contentType
              );
            }
          }}
          radius="sm"
        >
          <CaretRight size={24} className="fill-text-white" />
        </Button>
      )}
    </div>
  );
};
export default FormQuizz;

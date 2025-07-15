/* eslint-disable indent */
import { forwardRef, useImperativeHandle, useState } from 'react';

import { Button, Input, ModalBody, Spinner, Textarea } from '@nextui-org/react';
import Image from 'next/image';
import CustomModal from '@/components/UI/CustomModal';
import Text from '@/components/UI/Text';
import { values } from 'video.js/dist/types/utils/obj';

interface IModalSubmitError {}

const ModalSubmitError = (props: IModalSubmitError, ref?: any) => {
  const [visible, setVisible] = useState(false);
  const [valuesError, setValuesError] = useState<any>({});

  useImperativeHandle(ref, () => {
    return {
      onOpen: (dataError: any) => {
        setValuesError(dataError);
        setVisible(true);
      },
      onClose: () => setVisible(false),
    };
  });
  const onVisible = () => {
    setVisible(!visible);
  };

  const isValidObjectives = valuesError?.objectives?.every(
    (item: any) => item?.name.trim() !== ''
  );
  const isValidIntenedLeaners = valuesError?.intenedLeaners?.every(
    (item: any) => item?.name.trim() !== ''
  );
  const isValidRequirements = valuesError?.requirements?.every(
    (item: any) => item?.name.trim() !== ''
  );

  const allLessonsHaveContent =
    Array.isArray(valuesError?.dataCurriculum) &&
    valuesError?.dataCurriculum.length > 0 &&
    valuesError?.dataCurriculum.every((section: any) => {
      if (section.lessons.length === 0) {
        return section.quizzes.length > 0;
      }

      return section.lessons.every(
        (lesson: any) =>
          (lesson.id && (!!lesson.content || !!lesson.info?.thumbnailUrl)) ||
          !lesson.id
      );
    });
  const allQuizzesHaveQuestions =
    Array.isArray(valuesError?.dataCurriculum) &&
    valuesError?.dataCurriculum.length > 0 &&
    valuesError?.dataCurriculum.every((section: any) => {
      if (section.quizzes.length === 0) {
        return section.lessons.length > 0;
      }

      return section.quizzes.every(
        (quizz: any) =>
          (quizz.id &&
            Array.isArray(quizz.questions) &&
            quizz.questions.length > 0) ||
          !quizz.id
      );
    });

  return (
    <CustomModal
      placementMoblie="center"
      size="lg"
      isOpen={visible}
      onClose={onVisible}
    >
      <>
        <ModalBody className="p-6 flex flex-col gap-2">
          <div className="flex justify-center items-center flex-col gap-2">
            <Image
              alt=""
              src={'/images/img-warning.png'}
              width={120}
              height={120}
              className="w-[120px] h-full mx-auto md:mx-0"
            />
            <Text type="font-20-700" className="text-white">
              {'Publish course'}
            </Text>
            <Text type="font-16-400" className="text-black-6 text-start">
              {'Please enter the required fields'}
            </Text>
            <div className="flex flex-col gap-3 items-start my-3">
              {(!isValidObjectives ||
                !isValidIntenedLeaners ||
                !isValidRequirements) && (
                <Text className="text-error">
                  {
                    '- Please fill in all information for the lntended learners section.'
                  }
                </Text>
              )}
              {(!allLessonsHaveContent || !allQuizzesHaveQuestions) && (
                <Text className="text-error">
                  {
                    '- Please create full content and quiz questions for the section.'
                  }
                </Text>
              )}

              {(!valuesError?.title ||
                !valuesError?.categoryId ||
                !valuesError?.level ||
                !valuesError?.lang) && (
                <Text className="text-error">
                  {
                    '- Please fill in all information for the course langding page.'
                  }
                </Text>
              )}
              {(!valuesError?.price || !valuesError?.originPrice) && (
                <Text className="text-error">
                  {'- Please fill in all information for the set price.'}
                </Text>
              )}
            </div>
            <Button
              onPress={onVisible}
              className="bg-main w-full min-h-[40px] rounded mt-2"
            >
              <Text className="text-white" type="font-16-600">
                {'Ok'}
              </Text>
            </Button>
          </div>
        </ModalBody>
      </>
    </CustomModal>
  );
};
export default forwardRef(ModalSubmitError);

import {
  useCreateLecture,
  useCreateQuestionQuizz,
  useCreateQuizz,
  useDeleteLecture,
  useDeleteQuestionQuizz,
  useDeleteQuizz,
  useEditLecture,
  useEditQuestionQuizz,
  useEditQuizz,
} from '@/components/CreateCourse/service';
import IconPlusMain from '@/components/UI/Icons/IconPlusMain';
import Text from '@/components/UI/Text';
import { LessonContentType, TYPE_COURSE } from '@/utils/const';
import { Button } from '@nextui-org/react';
import {
  FileText,
  MonitorPlay,
  PencilSimpleLine,
  Question,
  Trash,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { IconClose } from '..';
import FormSelectItem from './FomSelectItem';
import FormAddLecture from './FormAddLecture';
import FormAddQuizz from './FormAddQuizz';
import FormLecture from './FormLecture';
import FormQuiz from './FormQuiz';

import InputText from '@/components/UI/InputText';
import classNames from 'classnames';
import { useCurriculumContext } from '../context';
import ModalConfirmDeleteSection from '../ModalConfirmDeleteSection';
import Content from './Content';
import ContentQuestions from './ContentQuestions';
import ModalConfirmDeleteQuestion from './ContentQuestions/ModalConfirmDeleteQuestion';

const CurriculumItem = ({ item }: { item: any }) => {
  const [dataCurriculum, setDataCurriculum] = useState<any>([]);
  const [isAddCurriculum, setIsAddCurriculum] = useState<boolean>(false);
  const [formAdd, setFormAdd] = useState<string>('');
  const [valueEditEditCotentLesson, setValueEditCotentLesson] = useState<any>(
    {}
  );

  console.log({ item });
  const refModalConfirmDeleteSection: any = useRef(null);
  const refModalConfirmDeleteQuestion: any = useRef(null);

  const [typeAddContent, setTypeAddContent] = useState<string>('');
  const [valueTitleLecture, setValueTitleLecture] = useState<string>('');

  const [typeAddQuizzQuestion, setAddQuizzQuestion] = useState<string>('');

  const [valueContent, setValueContent] = useState<string>('');
  const [valueInfo, setValueInfo] = useState<any>({});

  const [valueQuestion, setValueQuestion] = useState<any>({});

  const [indexContentAdd, setIndexAddContent] = useState<any>([]);
  const [indexAddQuestion, setIndexAddQuestion] = useState<any>([]);
  const [idAddQuestionQuizz, setIdAddQuestionQuizz] = useState<string>('');

  const { handleUpdateEditLessonId, handleUpdateShowBoundingBox } =
    useCurriculumContext();

  useEffect(() => {
    if (item?.id) {
      const newLessons = item?.lessons?.map(
        (lesson: any, indexLesson: number) => {
          return {
            ...lesson,
            type: TYPE_COURSE.LECTURE,
            sttLesson: indexLesson + 1,
          };
        }
      );

      const newQuizzes = item?.quizzes?.map(
        (quizz: any, indexQuizz: number) => {
          return {
            ...quizz,
            type: TYPE_COURSE.QUIZ,
            sttQuizz: indexQuizz + 1,
          };
        }
      );
      const itemsCurriculum = newLessons?.concat(newQuizzes);

      setDataCurriculum(itemsCurriculum);
    }
  }, [item?.id]);

  const { run: runCreateLecture, loading: loadingLecture } = useCreateLecture({
    onSuccess(res) {
      const dataQuizz =
        dataCurriculum?.filter(
          (item: any) => item?.type === TYPE_COURSE.QUIZ
        ) || [];
      const dataLesson = dataCurriculum?.filter(
        (item: any) => item?.type === TYPE_COURSE.LECTURE
      );
      const newDataLesson =
        dataLesson?.length > 0 ? [...dataLesson, res?.data] : [res.data];
      const formatSttData = newDataLesson?.map((item, indexLesson: number) => {
        return {
          ...item,
          sttLesson: indexLesson + 1,
          type: TYPE_COURSE.LECTURE,
        };
      });
      const dataConcat = dataQuizz.concat(formatSttData);

      setDataCurriculum(dataConcat);
      setFormAdd('');
      setIsAddCurriculum(false);
    },
  });

  const { run: runDeleteLecture, loading: loadingDeleteLecture } =
    useDeleteLecture({
      onSuccess(res) {},
    });
  const { run: runDeleteQuizz, loading: loadingDeleteQuizz } = useDeleteQuizz({
    onSuccess(res) {},
  });

  const { run: runEditLecture, loading: loadingEditLecture } = useEditLecture({
    onSuccess(res) {
      setTypeAddConten'';
      setValueEditCotentLesson({});
      setValueTitleLecture('');
      const index = dataCurriculum.findIndex(
        (item: any) => item.id === res?.data?.id
      );
      if (index !== -1) {
        dataCurriculum[index] = { ...dataCurriculum[index], ...res?.data };
      }
    },
  });
  const { run: runEditQuizz, loading: loadingEditQuizz } = useEditQuizz({
    onSuccess(res) {
      setValueEditCotentLesson({});
      setValueTitleLecture('');
      const index = dataCurriculum.findIndex(
        (item: any) => item.id === res?.data?.id
      );
      if (index !== -1) {
        dataCurriculum[index] = { ...dataCurriculum[index], ...res?.data };
      }
    },
  });
  const { run: runCreateQuestionQuizz, loading: loadingCreateQuestionQuizz } =
    useCreateQuestionQuizz({
      onSuccess(res) {
        setAddQuizzQuestion('');
        const index = dataCurriculum.findIndex(
          (item: any) => item.id === idAddQuestionQuizz
        );

        if (index !== -1) {
          if (dataCurriculum[index].questions?.length > 0) {
            dataCurriculum[index] = {
              ...dataCurriculum[index],
              questions: [...dataCurriculum[index].questions, res?.data],
            };
          } else {
            dataCurriculum[index] = {
              ...dataCurriculum[index],
              questions: [res?.data],
            };
          }
        }
      },
    });
  const { run: runEditQuestionQuizz, loading: loadingEditQuestionQuizz } =
    useEditQuestionQuizz({
      onSuccess(res) {
        setValueQuestion({});
        setAddQuizzQuestion('');
        const index = dataCurriculum.findIndex(
          (item: any) => item.id === idAddQuestionQuizz
        );

        if (index !== -1) {
          const questionIndex = dataCurriculum[index].questions.findIndex(
            (question: any) => question.id === res?.data.id
          );

          if (questionIndex !== -1) {
            dataCurriculum[index].questions[questionIndex] = res?.data;
          }
        }
      },
    });

  const { run: runDeleteQuestionQuizz, loading: loadingDeleteQuestionQuizz } =
    useDeleteQuestionQuizz({
      onSuccess(res) {},
    });

  const { run: runCreateQuizz, loading: loadingQuizz } = useCreateQuizz({
    onSuccess(res) {
      const dataQuizz = dataCurriculum?.filter(
        (item: any) => item?.type === TYPE_COURSE.QUIZ
      );
      const dataLesson = dataCurriculum?.filter(
        (item: any) => item?.type === TYPE_COURSE.LECTURE
      );
      const newDataQuizz = [...dataQuizz, res?.data];

      const formatSttData = newDataQuizz?.map((item, indexQuizz: number) => {
        return {
          ...item,
          sttQuizz: indexQuizz + 1,
          type: TYPE_COURSE.QUIZ,
        };
      });
      const dataConcat = dataLesson.concat(formatSttData);

      setDataCurriculum(dataConcat);
      setFormAdd('');
      setIsAddCurriculum(false);
    },
  });

  const handleAddCurriculumItem = () => {
    setIsAddCurriculum(true);
  };

  const handleClickItemAdd = (type: TYPE_COURSE) => {
    setFormAdd(type);
  };

  const handleSaveVideo = (values: any, id: string, index: number) => {
    const newData = indexContentAdd?.filter((item: any) => item !== index);
    setIndexAddContent(newData);
    const body = {
      info: values,
      contentType: LessonContentType?.VIDEO,
    };
    console.log(body, values, 'body:::');

    runEditLecture(body, id);
  };

  const handleSaveArticle = (value: string, id: string, index: number) => {
    const newData = indexContentAdd?.filter((item: any) => item !== index);
    setIndexAddContent(newData);
    const body = {
      content: value,
      contentType: LessonContentType?.ARTICLE,
    };
    runEditLecture(body, id);
  };
  const handleSaveAddQuestion = (
    values: any,
    id: string,
    index: number,
    quizzes: any,
    idEdit?: string
  ) => {
    const newData = indexAddQuestion?.filter((item: any) => item !== index);
    setIndexAddQuestion(newData);
    setIdAddQuestionQuizz(id);

    const body = {
      question: values?.question,
      answers: values?.answers,
      ordinalNumber: quizzes?.length > 0 ? quizzes?.length : 1,
    };
    if (idEdit) {
      runEditQuestionQuizz(body, idEdit);
    } else {
      runCreateQuestionQuizz(body, id);
    }
  };

  const handleCancelFormLecture = () => {
    setFormAdd('');
  };

  const handleAddFormLecture = (value: string) => {
    const body = {
      title: value,
      ordinalNumber: dataCurriculum?.length ? dataCurriculum?.length : 1,
      sectionId: item?.idSection,
    };

    runCreateLecture(body);
  };
  const handleAddFormQuizz = (values: {
    title: string;
    description: string;
  }) => {
    const body = {
      title: values?.title,
      description: values?.description,
      ordinalNumber: dataCurriculum?.length ? dataCurriculum?.length : 1,
      sectionId: item?.idSection,
    };
    runCreateQuizz(body);
  };
  const handleCancelQuizz = () => {
    setFormAdd('');
  };

  const handleClickAddContent = (item: any, index: number) => {
    const type = item?.type as TYPE_COURSE;

    // if (editLessonId) {
    //   handleUpdateShowBoundingBox(true);
    //   toast.error('Please save the lesson before adding a new item');
    //   return;
    // } else {
    //   handleUpdateEditLessonId(item?.id);
    // }

    handleUpdateEditLessonId(item?.id);

    if (type === TYPE_COURSE.LECTURE) {
      setIndexAddContent((prev: any) =>
        prev.includes(index)
          ? prev.filter((i: any) => i !== index)
          : [...prev, index]
      );
      setTypeAddContent(type);
    } else {
      setAddQuizzQuestion(type);

      setIndexAddQuestion((prev: any) =>
        prev.includes(index)
          ? prev.filter((i: any) => i !== index)
          : [...prev, index]
      );
    }
  };

  const handleClickEditContent = (
    content: string,
    type: TYPE_COURSE,
    index: number,
    info: any
  ) => {
    setTypeAddContent(type);
    setValueContent(content);
    setValueInfo(info);

    setIndexAddContent((prev: any) =>
      prev.includes(index)
        ? prev.filter((i: any) => i !== index)
        : [...prev, index]
    );
  };

  const handleSubmitDeleteQuestion = (values: any) => {
    const newData = [...dataCurriculum];

    const index = newData?.findIndex((item) => item?.id === values?.quizId);

    const questionIndex = newData[index]?.questions?.findIndex(
      (q: any) => q?.id === values?.id
    );

    newData[index]?.questions?.splice(questionIndex, 1);

    setDataCurriculum(newData);

    runDeleteQuestionQuizz(values?.id);
  };

  const handleClickDeleteQuestion = (values: any) => {
    refModalConfirmDeleteQuestion.current.onOpen(values);
  };
  const handleClickEditQuestion = (
    values: any,
    type: TYPE_COURSE,
    index: number
  ) => {
    setAddQuizzQuestion(type);
    setValueQuestion(values);
    setIndexAddQuestion((prev: any) =>
      prev.includes(index)
        ? prev.filter((i: any) => i !== index)
        : [...prev, index]
    );
  };

  const handleEditLecture = (item: any) => {
    setValueEditCotentLesson(item);
  };
  const handleRemoveLecture = (index: number, id: string, type: string) => {
    // setValueEditCotentLesson(item);
    refModalConfirmDeleteSection.current.onOpen(index, id, type);
  };

  const handleSubmitDeleteLecture = (
    index: number,
    id: string,
    type?: string
  ) => {
    if (type === TYPE_COURSE.LECTURE) {
      runDeleteLecture(id);
      const newData = dataCurriculum?.filter((item: any) => item?.id !== id);
      setDataCurriculum(newData);
    } else {
      runDeleteQuizz(id);
      const newData = dataCurriculum?.filter((item: any) => item?.id !== id);
      setDataCurriculum(newData);
    }
  };

  const handleSaveEditContentLesson = () => {
    const body = {
      title: valueTitleLecture,
    };

    if (valueEditEditCotentLesson?.type === TYPE_COURSE.QUIZ) {
      runEditQuizz(body, valueEditEditCotentLesson?.id);
    } else {
      runEditLecture(body, valueEditEditCotentLesson?.id);
    }
  };

  return (
    <div
      className={classNames(
        'flex flex-col min-w-[600px] gap-4 pl-[20px] md:pl-[52px] relative w-full'
      )}
    >
      {dataCurriculum?.map((item: any, indexCurriculum: number) => {
        return (
          <div className={classNames('w-full', {})} key={item?.id}>
            <div
              className={clsx(
                'rounded flex cursor-pointer justify-between group items-center w-full py-2 px-3 bg-transparent border-1 border-white-15',
                {
                  ['rounded-b-none']: [
                    TYPE_COURSE.LECTURE,
                    TYPE_COURSE.QUIZ,
                  ].includes(item?.type),
                }
              )}
            >
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-2 w-full">
                  <IconCheck />
                  <div>
                    <Text
                      type="font-16-600"
                      className={clsx('text-white w-max', {})}
                    >
                      {item?.type === TYPE_COURSE.LECTURE
                        ? `${'Lecture'} ${item?.sttLesson}:`
                        : `${'Quiz'} ${item?.sttQuizz}:`}
                    </Text>
                  </div>

                  {valueEditEditCotentLesson?.id === item?.id ? (
                    <div className="w-full">
                      <InputText
                        maxLength={160}
                        endContent
                        autoFocus
                        defaultValue={valueEditEditCotentLesson?.title}
                        classInputWrapper="!min-h-[30px] min-w-full"
                        className="min-w-full"
                        onChange={(e: any) =>
                          setValueTitleLecture(e.target.value)
                        }
                        placeholder={'Enter title'}
                        inputDefault
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      {item?.type === TYPE_COURSE.LECTURE ? (
                        <>
                          {item?.contentType === LessonContentType?.VIDEO ? (
                            <MonitorPlay size={20} weight="light" />
                          ) : (
                            <FileText size={20} weight="light" />
                          )}
                        </>
                      ) : (
                        <Question color="#8C8C8C" weight="bold" size={20} />
                      )}
                      <Text type="font-16-500" className="text-black-7">
                        {item.title}
                      </Text>

                      <Button
                        isIconOnly
                        onPress={() => {
                          handleEditLecture(item);
                        }}
                        size="sm"
                        radius="full"
                        variant="light"
                        className="md:group-hover:opacity-100 md:opacity-0 transition-all"
                      >
                        <PencilSimpleLine size={16} weight="light" />
                      </Button>
                      <Button
                        isIconOnly
                        onPress={() => {
                          handleRemoveLecture(
                            indexCurriculum,
                            item?.id,
                            item?.type
                          );
                        }}
                        size="sm"
                        radius="full"
                        variant="light"
                        className="md:group-hover:opacity-100 md:opacity-0 transition-all"
                      >
                        <Trash size={16} weight="light" />
                      </Button>
                    </div>
                  )}
                </div>
                {valueEditEditCotentLesson?.id === item?.id && (
                  <div className="flex items-center justify-end mb-2 gap-3">
                    <Button
                      onPress={() => setValueEditCotentLesson({})}
                      variant="light"
                      className="rounded"
                    >
                      <Text type="font-16-400">{'Cancel'}</Text>
                    </Button>
                    <Button
                      isLoading={loadingEditLecture || loadingEditQuizz}
                      onPress={handleSaveEditContentLesson}
                      className="rounded min-w-[100px] bg-main"
                    >
                      <Text type="font-16-400">{'Save'}</Text>
                    </Button>
                  </div>
                )}
              </div>

              {indexContentAdd?.includes(indexCurriculum) ||
              indexAddQuestion?.includes(indexCurriculum) ? (
                <div className="flex items-center gap-3">
                  <Text type="font-14-500" className="w-max">
                    {'Select content type'}
                  </Text>
                  <Button
                    onPress={() => {
                      const newData = indexContentAdd?.filter(
                        (item: any) => item !== indexCurriculum
                      );
                      const newDataQuestion = indexAddQuestion?.filter(
                        (item: any) => item !== indexCurriculum
                      );
                      setIndexAddContent(newData);
                      setIndexAddQuestion(newDataQuestion);
                      setValueConten'';
                      setValueInfo({});
                      setValueQuestion({});
                    }}
                    isIconOnly
                    variant="light"
                    radius="full"
                    size="sm"
                  >
                    <IconClose />
                  </Button>
                </div>
              ) : (
                <>
                  {item?.content || item?.info?.duration ? null : (
                    <>
                      {!valueEditEditCotentLesson?.id && (
                        <Button
                          onPress={() =>
                            handleClickAddContent(item, indexCurriculum)
                          }
                          className="border-main border-1 bg-transparent rounded h-[30px]"
                        >
                          <div className="flex items-center gap-1">
                            <IconPlusMain />
                            <Text type="font-16-400" className="text-main">
                              {item.type === TYPE_COURSE.LECTURE
                                ? 'Content'
                                : 'Question'}
                            </Text>
                          </div>
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            {(item?.content || item?.info?.duration) &&
              !indexContentAdd?.includes(indexCurriculum) && (
                <Content
                  info={item?.info}
                  type={item?.contentType}
                  handleClickEditContent={() =>
                    handleClickEditContent(
                      item.content,
                      item?.contentType,
                      indexCurriculum,
                      item?.info
                    )
                  }
                />
              )}
            {item?.questions?.length > 0 &&
              !indexAddQuestion?.includes(indexCurriculum) && (
                <ContentQuestions
                  handleClickDeleteQuestion={handleClickDeleteQuestion}
                  handleClickEditQuestion={(values) => {
                    handleClickEditQuestion(
                      values,
                      item?.type,
                      indexCurriculum
                    );
                  }}
                  questions={item?.questions}
                />
              )}
            {typeAddContent && indexContentAdd?.includes(indexCurriculum) && (
              <>
                <FormAddLecture
                  typeAddContent={typeAddContent}
                  valueContent={valueContent}
                  valueInfo={valueInfo}
                  handleSaveVideo={(values) =>
                    handleSaveVideo(values, item?.id, indexCurriculum)
                  }
                  handleSaveArticle={(value) =>
                    handleSaveArticle(value, item?.id, indexCurriculum)
                  }
                  loading={loadingEditLecture}
                  lectureItem={item}
                />
              </>
            )}

            {typeAddQuizzQuestion === TYPE_COURSE.QUIZ &&
              indexAddQuestion.includes(indexCurriculum) && (
                <FormAddQuizz
                  valueQuestion={valueQuestion}
                  loading={
                    loadingCreateQuestionQuizz || loadingEditQuestionQuizz
                  }
                  handleSaveAddQuestion={(values, idEdit) =>
                    handleSaveAddQuestion(
                      values,
                      item?.id,
                      indexCurriculum,
                      item?.quizzes,
                      idEdit
                    )
                  }
                />
              )}
          </div>
        );
      })}

      {isAddCurriculum ? (
        <div className="flex items-start gap-1 relative">
          <div className="absolute left-[-28px] top-[-4px] md:top-0 md:left-[-38px]">
            <Button
              onPress={() => {
                setIsAddCurriculum(false);
                setFormAdd('');
              }}
              isIconOnly
              variant="light"
              radius="full"
              size="sm"
            >
              <IconClose />
            </Button>
          </div>

          {!formAdd && (
            <FormSelectItem handleClickItemAdd={handleClickItemAdd} />
          )}
          {formAdd === TYPE_COURSE.LECTURE && (
            <FormLecture
              loading={loadingLecture}
              handleAdd={handleAddFormLecture}
              handleCancel={handleCancelFormLecture}
            />
          )}
          {formAdd === TYPE_COURSE.QUIZ && (
            <FormQuiz
              loading={loadingQuizz}
              handleAdd={handleAddFormQuizz}
              handleCancel={handleCancelQuizz}
            />
          )}
        </div>
      ) : (
        <Button
          onPress={handleAddCurriculumItem}
          className="py-2 px-3 bg-transparent w-max border-1 border-white rounded"
        >
          <div className="flex items-center gap-1">
            <IconPlus />
            <Text>{'Curriculum item'}</Text>
          </div>
        </Button>
      )}
      <ModalConfirmDeleteSection
        handleSubmitDelete={handleSubmitDeleteLecture}
        ref={refModalConfirmDeleteSection}
        loading={loadingDeleteLecture || loadingDeleteQuizz}
      />
      <ModalConfirmDeleteQuestion
        loading={loadingDeleteQuestionQuizz}
        handleSubmitDelete={handleSubmitDeleteQuestion}
        ref={refModalConfirmDeleteQuestion}
      />
    </div>
  );
};
export default CurriculumItem;

const IconCheck = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M10 18.3337C5.39752 18.3337 1.66669 14.6028 1.66669 10.0003C1.66669 5.39783 5.39752 1.66699 10 1.66699C14.6025 1.66699 18.3334 5.39783 18.3334 10.0003C18.3334 14.6028 14.6025 18.3337 10 18.3337ZM9.16919 13.3337L15.0609 7.44116L13.8825 6.26283L9.16919 10.977L6.81169 8.61949L5.63335 9.79782L9.16919 13.3337Z"
        fill="var(--theme-white)"
      />
    </svg>
  );
};

const IconPlus = () => {
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
        fill="var(--theme-white)"
      />
    </svg>
  );
};

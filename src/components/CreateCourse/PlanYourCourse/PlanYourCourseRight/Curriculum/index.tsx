import IconPlusMain from '@/components/UI/Icons/IconPlusMain';
import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { Control, useFieldArray, useForm } from 'react-hook-form';
import InputText from '@/components/UI/InputText';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  useCreateSesson,
  useDeleteSesson,
  useEditSesson,
  useGetListSession,
} from '@/components/CreateCourse/service';
import { useRouter } from 'next/router';
import LoadingScreen from '@/components/UI/LoadingScreen';
import { useProfile } from '@/store/profile/useProfile';
import FormAddSection from './CurriculumItem/FormAddSection';
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';
import ModalConfirmDeleteSection from './ModalConfirmDeleteSection';
import { useTranslation } from 'next-i18next';

const CurriculumItem = dynamic(() => import('./CurriculumItem'), {
  ssr: false,
});
const Curriculum = ({ setValue }: any) => {
  const { t } = useTranslation('common');
  const {
    control,
    reset,
    handleSubmit,
    setValue: setValueForm,
  } = useForm<any>({});
  const { profile } = useProfile();

  const refModalConfirmDeleteSection: any = useRef(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections',
  });
  const [addSection, setAddSection] = useState(false);
  const [valueLesson, setValueLesson] = useState<any>({});

  const router = useRouter();

  console.log(fields, 'fields');

  const {
    run: runGetListSession,
    data: dataListSession,
    loading: loadingListSession,
  } = useGetListSession({
    onSuccess: (res) => {
      const newData = res?.data?.map((item: any) => {
        return {
          ...item,
          idSection: item?.id,
        };
      });
      setValue('sections', newData);
      reset({
        sections: newData,
      });
    },
  });

  useEffect(() => {
    if (router.query.id) {
      runGetListSession(router.query.id as string, profile?.id);
    }
  }, [router.query.id]);

  const { run: runCreateSesson, loading: loadingAddSection } = useCreateSesson({
    onSuccess(res) {
      setAddSection(false);
      runGetListSession(router.query.id as string, profile?.id);
    },
  });
  const { run: runEditSesson, loading: loadingEditSection } = useEditSesson({
    onSuccess(res) {
      setValueLesson({});
      runGetListSession(router.query.id as string, profile?.id);
    },
  });

  const { run: runDeleteSesson } = useDeleteSesson({
    onSuccess(res) {},
  });

  const handleSaveAddSection = (values: any, index: number) => {
    const body = {
      title: values?.title,
      learningObjective: values?.learningObjective,
      courseId: router.query.id as string,
      ordinalNumber: index + 1,
    };
    runCreateSesson(body);
  };
  const handleSaveEditSection = (values: any) => {
    const body = {
      title: values?.title,
      learningObjective: values?.learningObjective,
      courseId: router.query.id as string,
    };
    runEditSesson(body, valueLesson?.idSection);
  };

  const handleRemoveSection = (index: number, id: string) => {
    refModalConfirmDeleteSection.current.onOpen(index, id);
  };

  const handleSubmitDelete = (index: number, id: string) => {
    remove(index);
    if (id) {
      runDeleteSesson(id);
    }
    setAddSection(false);
  };
  const handleEditLesson = (item: any, index: number) => {
    const newData = {
      ...item,
      stt: index + 1,
    };
    setValueForm('title', item?.title);
    setValueLesson(newData);
  };

  console.log(fields, 'fields:::');
  return (
    <LoadingScreen isLoading={loadingListSession}>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <Text type="font-28-700" className="text-white">
            {t('Curriculum item')}
          </Text>
          {/* <Button className="rounded border-1 bg-transparent border-main min-h-[44px] w-max min-w-[154px]">
            <Text type="font-16-700" className="text-white">
              Bulk Uploader
            </Text>
          </Button> */}
        </div>

        <Text type="font-16-400" className="text-black-6">
          {t(
            'Start putting together your course by creating sections, lectures and practice activities (quizzes, coding exercises and assignments). Use your course outline to structure your content and label your sections and lectures clearly. If you’re intending to offer your course for free, the total length of video content must be less than 2 hours.'
          )}
        </Text>
        {fields?.map((field: any, index: number) => {
          return (
            <div className="flex flex-col gap-1 overflow-auto">
              {index !== 0 && (
                <Button
                  onPress={() => handleRemoveSection(index, field.idSection)}
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                >
                  <IconClose />
                </Button>
              )}

              {field?.title ? (
                <div className="border-1 overflow-auto bg-gray-80 border-black-10 rounded py-4 px-3 flex flex-col gap-6">
                  {valueLesson?.id === field?.id ? (
                    <FormAddSection
                      handleSaveAddSection={(values: any) => {
                        if (valueLesson?.id) {
                          handleSaveEditSection(values);
                        } else {
                          handleSaveAddSection(values, index);
                        }
                      }}
                      loading={loadingEditSection}
                      control={control}
                      valueLesson={valueLesson}
                      handleSubmit={handleSubmit}
                      handleCancelFormAddSection={() => {
                        setValueLesson({});
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Text type="font-16-700">{`${t('Part')} ${
                        index + 1
                      }:`}</Text>
                      <div className="flex items-center gap-1">
                        <IconFile />
                        <Text type="font-16-400" className="text-black-7">
                          {field.title}
                        </Text>
                        <Button
                          isIconOnly
                          onPress={() => {
                            handleEditLesson(field, index);
                          }}
                          size="sm"
                          radius="full"
                          variant="light"
                        >
                          <PencilSimpleLine size={16} weight="light" />
                        </Button>
                        {index !== 0 && (
                          <Button
                            isIconOnly
                            onPress={() => {
                              handleRemoveSection(index, field?.idSection);
                            }}
                            size="sm"
                            radius="full"
                            variant="light"
                          >
                            <Trash size={16} weight="light" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  <CurriculumItem item={field} />
                </div>
              ) : (
                <FormAddSection
                  handleSaveAddSection={(values: any) =>
                    handleSaveAddSection(values, index)
                  }
                  loading={loadingAddSection}
                  control={control}
                  handleSubmit={handleSubmit}
                  handleCancelFormAddSection={() => {
                    setAddSection(false);
                    remove(index);
                  }}
                />
              )}
            </div>
          );
        })}
        {!addSection && (
          <Button
            onPress={() => {
              setAddSection(true);
              append({ title: '', introduction: '' });
            }}
            className="bg-transparent rounded w-max min-h-9 py-2 px-3 border-1 border-main"
          >
            <div className="flex items-center gap-1">
              <IconPlusMain />
              <Text type="font-16-400" className="text-main">
                {t('Section')}
              </Text>
            </div>
          </Button>
        )}
      </div>
      <ModalConfirmDeleteSection
        handleSubmitDelete={handleSubmitDelete}
        ref={refModalConfirmDeleteSection}
      />
    </LoadingScreen>
  );
};
export default Curriculum;

export const IconClose = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M9.99999 8.82129L14.125 4.69629L15.3033 5.87462L11.1783 9.99962L15.3033 14.1246L14.125 15.303L9.99999 11.178L5.87499 15.303L4.69666 14.1246L8.82166 9.99962L4.69666 5.87462L5.87499 4.69629L9.99999 8.82129Z"
        fill="var(--theme-white)"
      />
    </svg>
  );
};

export const IconFile = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M6.75002 1.50225V1.5H14.9985C15.4125 1.5 15.75 1.84125 15.75 2.244V15.756C15.7498 15.9534 15.6713 16.1426 15.5316 16.2821C15.392 16.4216 15.2027 16.5 15.0053 16.5H2.99477C2.89628 16.4993 2.79888 16.4792 2.70815 16.4409C2.61742 16.4026 2.53513 16.3468 2.46597 16.2766C2.39681 16.2065 2.34215 16.1234 2.30509 16.0322C2.26804 15.9409 2.24933 15.8432 2.25002 15.7448V6L6.75002 1.50225ZM4.37252 6H6.75002V3.6225L4.37252 6ZM8.25002 3V6.75C8.25002 6.94891 8.171 7.13968 8.03035 7.28033C7.8897 7.42098 7.69893 7.5 7.50002 7.5H3.75002V15H14.25V3H8.25002Z"
        fill="#8C8C8C"
      />
    </svg>
  );
};

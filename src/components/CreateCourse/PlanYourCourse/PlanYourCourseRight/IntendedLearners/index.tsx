import { useEditCourse } from '@/components/CreateCourse/service';
import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { Button } from '@nextui-org/react';
import { Trash } from '@phosphor-icons/react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

const IntendedLearners = ({
  control,
}: {
  control: Control;
  idDetail: string;
  handleSubmit: any;
}) => {
  const { t } = useTranslation('common');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'objectives',
  });

  console.log(control, 'control');

  const {
    fields: fieldsRequirements,
    append: appendRequirements,
    remove: removeRequirements,
  } = useFieldArray({
    control,
    name: 'requirements',
  });

  const {
    fields: fieldsIntenedLeaners,
    append: appendIntenedLeaners,
    remove: removeIntenedLeaners,
  } = useFieldArray({
    control,
    name: 'intenedLeaners',
  });

  return (
    <div className="flex flex-col gap-8">
      <Text type="font-28-700" className="text-white">
        {t('Intended learners')}
      </Text>
      <Text type="font-16-400" className="text-black-6">
        {t(
          'The following descriptions will be publicly visible on your Course Landing Page and will have a direct impact on your course performance. These descriptions will help learners decide if your course is right for them.'
        )}
      </Text>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-[10px]">
          <Text type="font-16-600" className="text-white">
            {t('What will students learn in your course?')}
          </Text>
          <Text type="font-16-400" className="text-black-6">
            {t('You must enter at least 4')}
            <Text className="underline mx-1" element="span">
              {t('learning objectives or outcomes')}
            </Text>
            {t(
              'that learners can expect to achieve after completing your course.'
            )}
          </Text>
        </div>
        {fields?.map((item: any, index) => {
          return (
            <div key={item?.id} className="flex items-center gap-3">
              <div className="w-full">
                <Controller
                  name={`objectives.${index}.name`}
                  control={control}
                  render={({ field }) => {
                    console.log(field, 'field');

                    return (
                      <InputText
                        {...field}
                        maxLength={160}
                        endContent
                        className="md:min-w-[500px]"
                        placeholder={
                          item?.pladholder ? item?.pladholder : t('Type')
                        }
                        inputDefault
                      />
                    );
                  }}
                />
              </div>

              {index > 3 && (
                <Button
                  onPress={() => remove(index)}
                  variant="light"
                  isIconOnly
                  radius="full"
                >
                  <Trash size={20} weight="light" />
                </Button>
              )}
            </div>
          );
        })}

        <Button
          onPress={() => append({ name: '' })}
          size="sm"
          variant="light"
          className="w-max"
        >
          <Text type="font-16-600" className="text-main">
            {t('+ Add more to your answer')}
          </Text>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <Text type="font-16-600" className="text-white">
          {t(
            'What are the requirements or prerequisites for taking your course?'
          )}
        </Text>
        <Text type="font-16-400" className="text-black-6">
          {t(
            'List the required skills, experience, tools or equipment learners should have prior to taking your course. If there are no requirements, use this space as an opportunity to lower the barrier for beginners.'
          )}
        </Text>

        {fieldsRequirements?.map((item: any, index) => {
          return (
            <div key={item?.id} className="flex items-center gap-3">
              <div className="w-full">
                <Controller
                  name={`requirements.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      maxLength={160}
                      endContent
                      className="md:min-w-[500px]"
                      placeholder={
                        item?.pladholder ? item?.pladholder : t('Type')
                      }
                      inputDefault
                    />
                  )}
                />
              </div>
              {index > 0 && (
                <Button
                  onPress={() => removeRequirements(index)}
                  variant="light"
                  isIconOnly
                  radius="full"
                >
                  <Trash size={20} weight="light" />
                </Button>
              )}
            </div>
          );
        })}

        <Button
          onPress={() => appendRequirements({ name: '' })}
          size="sm"
          variant="light"
          className="w-max"
        >
          <Text type="font-16-600" className="text-main">
            {t('+ Add more to your answer')}
          </Text>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <Text type="font-16-600" className="text-white">
          {t('Who is this course for?')}
        </Text>
        <Text type="font-16-400" className="text-black-6">
          {t(
            'List the required skills, experience, tools or equipment learners should have prior to taking your course. If there are no requirements, use this space as an opportunity to lower the barrier for beginners.'
          )}
        </Text>

        {fieldsIntenedLeaners?.map((item: any, index) => {
          return (
            <div key={item?.id} className="flex items-center gap-3">
              <div className="w-full">
                <Controller
                  name={`intenedLeaners.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      maxLength={160}
                      endContent
                      className="md:min-w-[500px]"
                      placeholder={
                        item?.pladholder ? item?.pladholder : t('Type')
                      }
                      inputDefault
                    />
                  )}
                />
              </div>
              {index > 0 && (
                <Button
                  onPress={() => removeIntenedLeaners(index)}
                  variant="light"
                  isIconOnly
                  radius="full"
                >
                  <Trash size={20} weight="light" />
                </Button>
              )}
            </div>
          );
        })}

        <Button
          onPress={() => appendIntenedLeaners({ name: '' })}
          size="sm"
          variant="light"
          className="w-max"
        >
          <Text type="font-16-600" className="text-main">
            {t('+ Add more to your answer')}
          </Text>
        </Button>
      </div>
      {/* <Button
          // onClick={handleSubmit(onSubmit)}
          isLoading={requestEditCourse?.loading}
          className="min-h-[44px] rounded bg-main w-max min-w-[136px]"
        >
          <Text type="font-16-700" className="text-white">
            Save profile
          </Text>
        </Button> */}
    </div>
  );
};
export default IntendedLearners;

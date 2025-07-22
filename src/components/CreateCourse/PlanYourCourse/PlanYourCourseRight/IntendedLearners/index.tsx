import { useEditCourse } from '@/components/CreateCourse/service';
import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { Button } from '@nextui-org/react';
import { Trash } from '@phosphor-icons/react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
const IntendedLearners = ({
  control,
  errors,
  validationErrors,
}: {
  control: Control;
  idDetail: string;
  handleSubmit: any;
  errors: any;
  validationErrors?: any;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'objectives',
  });

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
      <Text type="font-28-700" className="text-letter">
        {'Intended learners'}
      </Text>
      <Text type="font-16-400" className="text-letter/70">
        The following descriptions will be publicly visible on your Course
        Landing Page and will have a direct impact on your course performance.
        These descriptions will help learners decide if your course is right for
        them.
      </Text>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-[10px]">
          <Text type="font-16-600" className="text-letter">
            What will students learn in your course?
          </Text>
          <Text type="font-16-400" className="text-letter/70">
            You must enter at least 4
            <Text className="underline mx-1" element="span">
              learning objectives or outcomes
            </Text>
            that learners can expect to achieve after completing your course.
          </Text>
        </div>
        {fields?.map((item: any, index) => {
          return (
            <div key={item?.id} className="flex items-start gap-3">
              <div className="flex-1 flex items-center gap-1">
                <Controller
                  name={`objectives.${index}.name`}
                  rules={{
                    validate: (value) => {
                      if (!value || !value.trim())
                        return 'Please enter a value or remove this field';
                    },
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <InputText
                        {...field}
                        maxLength={160}
                        endContent
                        className="md:min-w-[500px]"
                        placeholder={
                          item?.pladholder
                            ? item?.pladholder
                            : 'Understand the fundamentals of [Topic] and its real-world applications'
                        }
                        inputDefault
                        error={errors?.objectives?.[index]?.name?.message}
                        classInputWrapper={
                          validationErrors?.intendedLearners &&
                          (!field.value || !field.value.trim())
                            ? '!border-red-500'
                            : ''
                        }
                      />
                    );
                  }}
                />
              </div>

              {index > 0 && (
                <Button
                  onPress={() => remove(index)}
                  variant="light"
                  isIconOnly
                  radius="full"
                  className="mt-1.5"
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
            {'+ Add more to your answer'}
          </Text>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <Text type="font-16-600" className="text-letter">
          What are the requirements or prerequisites for taking your course?
        </Text>
        <Text type="font-16-400" className="text-letter/70">
          List the required skills, experience, tools or equipment learners
          should have prior to taking your course. If there are no requirements,
          use this space as an opportunity to lower the barrier for beginners.
        </Text>

        {fieldsRequirements?.map((item: any, index) => {
          return (
            <div key={item?.id} className="flex items-start gap-3">
              <div className="flex-1 flex items-center gap-1">
                <Controller
                  name={`requirements.${index}.name`}
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (!value || !value.trim())
                        return 'Please enter a value or remove this field';
                    },
                  }}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      maxLength={160}
                      endContent
                      className="md:min-w-[500px] flex-1 text-letter"
                      placeholder={
                        item?.pladholder
                          ? item?.pladholder
                          : 'No prior experience needed – this course is beginner-friendly!'
                      }
                      inputDefault
                      error={errors?.requirements?.[index]?.name?.message}
                      classInputWrapper={
                        validationErrors?.intendedLearners &&
                        (!field.value || !field.value.trim())
                          ? '!border-red-500'
                          : ''
                      }
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
                  className="mt-1.5"
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
            {'+ Add more to your answer'}
          </Text>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <Text type="font-16-600" className="text-letter">
          {'Who is this course for?'}
        </Text>
        <Text type="font-16-400" className="text-letter/70">
          List the required skills, experience, tools or equipment learners
          should have prior to taking your course. If there are no requirements,
          use this space as an opportunity to lower the barrier for beginners.
        </Text>

        {fieldsIntenedLeaners?.map((item: any, index) => {
          return (
            <div key={item?.id} className="flex items-start gap-3">
              <div className="flex-1 flex items-center gap-1">
                <Controller
                  name={`intenedLeaners.${index}.name`}
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (!value || !value.trim())
                        return 'Please enter a value or remove this field';
                    },
                  }}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      maxLength={160}
                      endContent
                      className="md:min-w-[500px] flex-1"
                      placeholder={
                        item?.pladholder
                          ? item?.pladholder
                          : 'Beginners who want to learn [Topic] from scratch'
                      }
                      inputDefault
                      classInputWrapper={
                        validationErrors?.intendedLearners &&
                        (!field.value || !field.value.trim())
                          ? '!border-red-500'
                          : ''
                      }
                      error={errors?.intenedLeaners?.[index]?.name?.message}
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
                  className="mt-1.5"
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
            {'+ Add more to your answer'}
          </Text>
        </Button>
      </div>
      {/* <Button
          // onClick={handleSubmit(onSubmit)}
          isLoading={requestEditCourse?.loading}
          className="min-h-[44px] rounded bg-main w-max min-w-[136px]"
        >
          <Text type="font-16-700" className="text-letter">
            Save profile
          </Text>
        </Button> */}
    </div>
  );
};
export default IntendedLearners;

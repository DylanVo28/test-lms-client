import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { Control, useFieldArray } from 'react-hook-form';
const Referral = ({ control }: { control: Control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'referrals',
  });

  const {
    fields: fields1,
    append: append1,
    remove: remove1,
  } = useFieldArray({
    control,
    name: 'referral2',
  });

  return (
    <div className="flex flex-col gap-8">
      <Text type="font-28-700" className="text-letter">
        {'Referral'}
      </Text>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-[10px]">
          <Text type="font-16-600" className="text-letter">
            {'Choose Exchange'}
          </Text>

          <Text type="font-16-600" className="text-black-6">
            {
              'You must enter at least 4 learning objectives or outcomes that learners can expect to achieve after completing your course.'
            }
          </Text>
        </div>
        {fields?.map((field: any, index) => {
          return (
            <div key={field?.id} className="flex items-center gap-3">
              <InputText
                maxLength={160}
                endContent
                className="min-w-[500px]"
                placeholder={field.type}
                inputDefault
              />
            </div>
          );
        })}

        <Button
          onPress={() => append({ type: 'OKX' })}
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
        <div className="flex flex-col gap-[10px]">
          <Text type="font-16-600" className="text-letter">
            {
              'What are the requirements or prerequisites for unlocking free course?'
            }
          </Text>

          <Text type="font-16-600" className="text-black-6">
            {
              'List the required skills, experience, tools or equipment learners should have prior to taking your course. If there are no requirements, use this space as an opportunity to lower the barrier for beginners.'
            }
          </Text>
        </div>
        {fields1?.map((field: any, index) => {
          return (
            <div key={field?.id} className="flex items-center gap-3">
              <InputText
                maxLength={160}
                endContent
                className="min-w-[500px]"
                placeholder={field.type}
                inputDefault
              />
            </div>
          );
        })}

        <Button
          onPress={() => append1({ type: 'Minimum trade volume' })}
          size="sm"
          variant="light"
          className="w-max"
        >
          <Text type="font-16-600" className="text-main">
            {'+ Add more to your answer'}
          </Text>
        </Button>
      </div>
    </div>
  );
};
export default Referral;

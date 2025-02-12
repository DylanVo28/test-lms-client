import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { useState } from 'react';

const FormLecture = ({
  handleCancel,
  handleAdd,
  loading,
}: {
  handleAdd: (value: string) => void;
  handleCancel: VoidFunction;
  loading: boolean;
}) => {
  const [valueTitle, setValueTitle] = useState('');
  const [isError, setIsError] = useState(false);
  return (
    <div className="border-1 bg-transparent mx-[6px] border-white/15 rounded py-4 px-3 flex flex-col gap-4 w-full">
      <div className="flex items-start w-full gap-2">
        <div className="w-[120px] mt-1">
          <Text type="font-16-700" className="text-white">
            New lecture:
          </Text>
        </div>
        <div className="w-full">
          <InputText
            maxLength={160}
            endContent
            error={isError && !valueTitle ? 'Field title is require' : ''}
            classInputWrapper="!min-h-[34px]"
            onChange={(e: any) => setValueTitle(e.target.value)}
            className="min-w-full"
            placeholder="Enter title"
            inputDefault
          />
        </div>
      </div>
      <div className="flex justify-end items-end">
        <div className="flex items-center gap-3">
          <Button onClick={handleCancel} variant="light" className="rounded">
            <Text type="font-16-400">Cancel</Text>
          </Button>
          <Button
            isLoading={loading}
            onClick={() => {
              if (valueTitle) {
                handleAdd(valueTitle);
              } else {
                setIsError(true);
              }
            }}
            className="rounded bg-main"
          >
            <Text type="font-16-400">Add lecture</Text>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormLecture;

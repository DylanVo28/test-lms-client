import QuillEditor from '@/components/UI/QuillEditor';
import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { useState } from 'react';

const FormAddArticle = ({
  handleSaveArticle,
  loading,
  valueContent,
}: {
  handleSaveArticle: (value: string) => void;
  loading: boolean;
  valueContent?: string;
}) => {
  const [valueDocument, setValueDocument] = useState(valueContent || '');
  const [isError, setIsError] = useState(false);
  return (
    <div className="flex justify-center py-3 px-4 flex-col border-1 border-t-0 border-white/15 items-center gap-4">
      <QuillEditor
        value={valueDocument}
        autoFocus
        error={isError && !valueDocument ? 'Field document is require' : ''}
        onChange={(value) => {
          setValueDocument(value);
        }}
        label="Document"
        inputDefault
      />
      <div className="justify-end flex w-full items-end">
        <Button
          isLoading={loading}
          onClick={() => {
            if (valueDocument) {
              handleSaveArticle(valueDocument);
            } else {
              setIsError(true);
            }
          }}
          className="bg-main rounded h-[30px] min-w-[100px]"
        >
          <Text type="font-16-400" className="text-white">
            Save
          </Text>
        </Button>
      </div>
    </div>
  );
};
export default FormAddArticle;

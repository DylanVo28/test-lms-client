import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';

const FormLecture = ({
  handleCancel,
  handleAdd,
  loading,
}: {
  handleAdd: (value: string) => void;
  handleCancel: VoidFunction;
  loading: boolean;
}) => {
  const { t } = useTranslation('common');
  const [valueTitle, setValueTitle] = useState('');
  const [isError, setIsError] = useState(false);
  return (
    <div className="border-1 bg-transparent border-white-15 rounded py-4 px-3 flex flex-col gap-4 w-full">
      <div className="flex items-start w-full gap-2">
        <div className="w-[120px] mt-1">
          <Text type="font-16-700" className="text-white">
            {t('New lecture:')}
          </Text>
        </div>
        <div className="w-full">
          <InputText
            maxLength={160}
            endContent
            error={isError && !valueTitle ? t('Field title is required') : ''}
            classInputWrapper="!min-h-[34px]"
            onChange={(e: any) => setValueTitle(e.target.value)}
            className="min-w-full"
            placeholder={t('Enter title')}
            inputDefault
          />
        </div>
      </div>
      <div className="flex justify-end items-end">
        <div className="flex items-center gap-3">
          <Button onPress={handleCancel} variant="light" className="rounded">
            <Text type="font-16-400">{t('Cancel')}</Text>
          </Button>
          <Button
            isLoading={loading}
            onPress={() => {
              if (valueTitle) {
                handleAdd(valueTitle);
              } else {
                setIsError(true);
              }
            }}
            className="rounded bg-main"
          >
            <Text className="text-text-white" type="font-16-400">
              {t('Add lecture')}
            </Text>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormLecture;

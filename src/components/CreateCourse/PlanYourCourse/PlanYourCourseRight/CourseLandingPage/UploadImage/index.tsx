import { useUploadFile } from '@/components/CreateCourse/service';
import LoadingScreen from '@/components/UI/LoadingScreen';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { Button, Progress, Spinner } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'next-i18next';

const UploadImage = ({ value, onChange }: { value: any; onChange: any }) => {
  const { t } = useTranslation('common');
  const fileInputRef: any = useRef(null);
  const [valueProgress, setValueProgress] = useState(0);
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    if (!value) {
      const interval = setInterval(() => {
        setValueProgress((v) => {
          if (v >= 100) {
            clearInterval(interval);
            return 100;
          }
          return v + 10;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setValueProgress(100);
    }
  }, [value]);

  const { run: runUploadFile, loading } = useUploadFile({
    onSuccess(res) {
      onChange(res?.data?.url);
    },
  });

  const handleFileChange = (event: any) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    const file = files[0];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        t('Can only upload files in .jpg, .jpeg, .gif or .png format')
      );

      return;
    }

    runUploadFile(file);
  };
  const handleClickUploadFile = () => {
    if (value) {
      setValueProgress(0);
      onChange(null);
      setInputKey(Date.now());
    } else {
      fileInputRef.current.click();
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <Text type="font-16-600" className="text-white">
        {t('Course image')}
      </Text>
      <input
        key={inputKey}
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="relative md:min-w-[480px] h-[270px] bg-default flex items-center justify-center">
          <Image
            src={value || '/img-default.png'}
            className="w-full md:w-[480px] h-[270px]"
            alt=""
            width={480}
            height={270}
          />
          {loading && (
            <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-50">
              <Spinner />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 md:gap-2">
          <Text type="font-16-600" className="text-white">
            {t(
              'Upload your course image here. It must meet our course image quality standards to be accepted. Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.'
            )}
          </Text>
          <div className="flex items-center gap-2">
            {value ? (
              <div className="relative w-full">
                <Progress
                  radius="none"
                  classNames={{
                    indicator: 'bg-main',
                    track: 'min-h-[48px]',
                  }}
                  className="w-full"
                  value={valueProgress}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Text type="font-16-500" className="text-white">
                    {valueProgress}%
                  </Text>
                </div>
              </div>
            ) : (
              <div className="py-3 px-[10px] w-full min-h-[48px] rounded border-1 bg-default border-black-10">
                <Text type="font-16-400" className="text-black-8">
                  {t('No file selected')}
                </Text>
              </div>
            )}

            <Button
              onClick={handleClickUploadFile}
              className="bg-transparent border-1 border-main min-w-[133px] min-h-[48px] rounded"
            >
              <Text type="font-16-700" className="text-main">
                {value ? t('Change') : t('Upload File')}
              </Text>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UploadImage;

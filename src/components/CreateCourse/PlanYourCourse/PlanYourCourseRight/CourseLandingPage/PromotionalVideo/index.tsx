import {
  serviceUploadFileInBackground,
  useUploadFile,
} from '@/components/CreateCourse/service';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { Button, Progress, Spinner } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import useHandleFileChange from '@/hooks/useHandleFileChange';
import { useS3MultipartUpload } from '@/hooks/useS3MultipartUpload';
import useVideoThumbFromUrl from '@/hooks/useVideoThumbFromUrl';
import CloseIcon from '@/layout/MainLayout/MainHeader/ThemeConfiguration/Icons/CloseIcon';

const PromotionalVideo = ({
  value,
  onChange,
  error,
}: {
  value: any;
  onChange: any;
  error: any;
}) => {
  const { t } = useTranslation('common');
  const fileInputRef: any = useRef(null);
  const [inputKey, setInputKey] = useState(Date.now());
  const [fileData, setFileData] = useState<any>({});

  const { handleFileChange } = useHandleFileChange({
    callback: (data: any) => {
      setFileData(data);
    },
  });

  const { upload, progress, uploading } = useS3MultipartUpload();

  const isHasVideo = !!fileData?.duration;

  // useEffect(() => {
  //   if (!value) {
  //     const interval = setInterval(() => {
  //       setValueProgress((v) => {
  //         if (v >= 100) {
  //           clearInterval(interval);
  //           return 100;
  //         }
  //         return v + 10;
  //       });
  //     }, 300);
  //     return () => clearInterval(interval);
  //   } else {
  //     setValueProgress(100);
  //   }
  // }, [value]);

  const { run: runUploadFile, loading } = useUploadFile({
    onSuccess(res) {
      onChange(res?.data?.url);
    },
  });

  // const handleFileChange = (event: any) => {
  //   const files = event.target.files;
  //   if (!files || files.length === 0) return;

  //   const allowedMimeTypes = [
  //     'video/mp4',
  //     'video/quicktime',
  //     'video/x-msvideo',
  //   ];
  //   const file = files[0];

  //   if (!allowedMimeTypes.includes(file.type)) {
  //     toast.error(t('Can only upload video in .mp4, .mov, .avi'));

  //     return;
  //   }
  // };

  console.log('fileData:::', fileData);

  const handleClickUploadFile = () => {
    setFileData({});
    fileInputRef.current.click();
  };

  const handleClickSaveVideo = async () => {
    if (uploading) return;
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    if (fileData?.video && fileData?.thumbnail) {
      const urlVideo = await upload(file);
      onChange(urlVideo);
      setFileData({});
    }
  };

  const videoThumbnail = useVideoThumbFromUrl(value);

  return (
    <div className="flex flex-col gap-3">
      <Text type="font-16-600" className="text-white">
        {t('Promotional video')}
      </Text>
      <input
        key={inputKey}
        type="file"
        accept=".mp4,.mov,.avi"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="relative md:w-[240px] w-full h-[180px] bg-default flex items-center justify-center">
          <Image
            src={
              isHasVideo
                ? fileData?.blobThumbnailUrl
                : videoThumbnail || '/img-default.png'
            }
            className="w-full md:w-[240px] h-[200px] object-contain"
            alt=""
            width={240}
            height={180}
          />
          {loading && (
            <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-50">
              <Spinner />
            </div>
          )}

          {isHasVideo && (
            <div
              className="absolute top-0 right-0 cursor-pointer p-2"
              onClick={() => {
                setFileData({});
                setInputKey(Date.now());
              }}
            >
              <CloseIcon />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 md:gap-2 flex-1">
          <Text type="font-16-600" className="text-white max-w-full">
            Your course image gives students a first impression of your course.
            A high-quality image helps attract more learners. Make sure it’s the
            right size and format—learn how to make it stand out!
          </Text>
          <div className="flex items-center gap-2">
            {(isHasVideo && uploading) || value ? (
              <div className="relative w-full">
                <Progress
                  radius="none"
                  classNames={{
                    indicator: 'bg-main',
                    track: 'min-h-[48px]',
                  }}
                  className="w-full"
                  value={value && !uploading ? 100 : progress}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Text type="font-16-500" className="text-white">
                    {value && !uploading ? '100%' : `${progress}%`}
                  </Text>
                </div>
              </div>
            ) : (
              <div className="py-3 px-[10px] w-full min-h-[48px] rounded border-1 bg-default border-black-10">
                <Text type="font-16-400" className="text-black-8">
                  {isHasVideo ? fileData?.videoName : t('No file selected')}
                </Text>
              </div>
            )}

            {!isHasVideo && (
              <Button
                onPress={handleClickUploadFile}
                className="bg-transparent border-1 border-main min-w-[133px] min-h-[48px] rounded"
              >
                <Text type="font-16-700" className="text-main">
                  {value ? t('Change') : t('Upload File')}
                </Text>
              </Button>
            )}

            {isHasVideo && (
              <Button
                onPress={handleClickSaveVideo}
                isDisabled={uploading}
                className="bg-transparent border-1 border-main min-w-[133px] min-h-[48px] rounded"
              >
                <Text type="font-16-700" className="text-main">
                  {uploading ? 'Saving...' : 'Save'}
                </Text>
              </Button>
            )}
          </div>
          {error && (
            <Text type="font-14-400" className="text-danger-300">
              {error}
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};
export default PromotionalVideo;

import {
  useUploadFile,
  useUploadMultipleFiles,
} from '@/components/CreateCourse/service';
import Text from '@/components/UI/Text';
import { Button, Progress } from '@nextui-org/react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { set } from 'video.js/dist/types/tech/middleware';
import { useTranslation } from 'next-i18next';

const FormAddVideo = ({
  handleSaveVideo,
  valueInfo,
}: {
  handleSaveVideo: (urlVideo: string) => void;
  valueInfo: any;
}) => {
  const { t } = useTranslation('common');
  const fileInputRef: any = useRef(null);
  const [valueFile, setValueFile] = useState<any>({});
  const [valueProgress, setValueProgress] = useState(0);
  const [inputKey, setInputKey] = useState(Date.now());

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (valueInfo?.duration) {
      setValueFile(valueInfo);
    }
  }, [valueInfo?.duration]);

  const { run: runUploadFiles, loading } = useUploadMultipleFiles({
    onSuccess: (response) => {
      setValueFile({
        ...valueFile,
        thumbnailUrl: response?.[1]?.data?.url,
        urlVideo: response?.[0]?.data?.url,
        fileNameVideo: response?.[0]?.data?.filename,
      });
    },
    onError: (err) => {
      console.error('File upload failed', err);
    },
  });

  useEffect(() => {
    if (!valueInfo?.duration) {
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
  }, [valueFile?.urlVideo, valueInfo?.duration]);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    // runUploadFile(file);
    if (file && file.type.startsWith('video/')) {
      // Get video duration
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration; // Thời gian video tính bằng giây
        setValueFile({
          ...valueFile,
          duration,
        });
        // Create a thumbnail (first frame)
        const canvas = document.createElement('canvas');
        const context: any = canvas.getContext('2d');
        videoElement.currentTime = 1; // Chọn thời điểm 1s đầu tiên

        videoElement.onseeked = () => {
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(async (blob: any) => {
            if (blob) {
              const thumbnailFile = new File([blob], 'thumbnail.jpg', {
                type: 'image/jpeg',
              });

              runUploadFiles(file, thumbnailFile);
            }
          }, 'image/jpeg');
        };
      };
    }
  };
  const handleClickUploadFile = () => {
    if (valueFile.urlVideo) {
      setValueProgress(0);
      setValueFile({});
      setInputKey(Date.now());
    } else {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex py-3 px-4 flex-col gap-3 border-1 border-t-0 border-white-15">
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-2 w-full">
          {valueFile?.urlVideo ? (
            <div className="relative w-full">
              <Progress
                radius="none"
                classNames={{
                  indicator: 'bg-main',
                  track: 'min-h-[43px]',
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
            <div
              onClick={handleClickUploadFile}
              className={clsx(
                'cursor-pointer w-full py-3 px-[10px] bgDefault rounded border-1 border-white-20',
                {
                  ['!border-danger-300']: !valueFile?.urlVideo && isError,
                }
              )}
            >
              <Text type="font-14-400" className="text-white/40">
                {t('No files selected')}
              </Text>
            </div>
          )}
          {isError && !valueFile?.urlVideo && (
            <Text type="font-14-400" className="text-danger-300">
              {t('Please upload the file')}
            </Text>
          )}
        </div>

        <input
          type="file"
          key={inputKey}
          ref={fileInputRef}
          accept=".mp4,.mov,.avi"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Button
          isLoading={loading}
          onPress={handleClickUploadFile}
          className="bg-transparent min-h-[43px] min-w-[120px] border-1 border-main rounded"
        >
          <Text type="font-14-400" className="text-main">
            {valueFile?.urlVideo ? t('Change video') : t('Select video')}
          </Text>
        </Button>
      </div>

      {valueFile?.urlVideo && (
        <Text type="font-12-500" className="text-white">
          {valueFile?.fileNameVideo}
        </Text>
      )}
      <Text type="font-12-500" className="text-yellow-500 italic">
        {t('Note: All files must be at least 720p and less than 4 GB.')}
      </Text>

      <div className="flex justify-end items-end">
        <Button
          onPress={() => {
            if (valueFile?.urlVideo) {
              handleSaveVideo(valueFile);
            } else {
              setIsError(true);
            }
          }}
          className="bg-main rounded h-[30px] min-w-[100px]"
        >
          <Text type="font-16-400" className="text-white">
            {t('Save')}
          </Text>
        </Button>
      </div>
    </div>
  );
};
export default FormAddVideo;

import { serviceUploadFileInBackground } from '@/components/CreateCourse/service';
import Text from '@/components/UI/Text';
import { LessonContentType } from '@/utils/const';
import { Button } from '@nextui-org/react';
import classNames from 'classnames';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import Content from '../Content';
import { useCurriculumContext } from '../../context';
import { useS3MultipartUpload } from '@/hooks/useS3MultipartUpload';
import useHandleFileChange from '@/hooks/useHandleFileChange';

const FormAddVideo = ({
  handleSaveVideo,
  valueInfo,
  lectureItem,
}: {
  handleSaveVideo: (info: any) => void;
  valueInfo: any;
  lectureItem: any;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, progress, uploading } = useS3MultipartUpload();

  const [valueProgress, setValueProgress] = useState(0);
  const [inputKey, setInputKey] = useState(Date.now());
  const [uploadFileLoading, setUploadFileLoading] = useState(false);

  const [isError, setIsError] = useState(false);

  const [formData, setFormData] = useState<any>({});

  const { handleUpdateEditLessonId, handleUpdateShowBoundingBox } =
    useCurriculumContext();

  const { handleFileChange } = useHandleFileChange({
    callback: (data: any) => {
      setFormData(data);
    },
  });

  const handleClickUploadFile = () => {
    if (!fileRef.current) return;
    fileRef.current.click();
  };

  const handleClickSaveVideo = async () => {
    if (uploading) return;
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    if (formData?.video && formData?.thumbnail) {
      const urlVideo = await upload(file);

      const thumbnailResponse = await serviceUploadFileInBackground(
        formData?.thumbnail
      );

      await handleSaveVideo({
        ...valueInfo,
        urlVideo,
        thumbnailUrl: thumbnailResponse?.data?.url,
        fileNameVideo: file.name,
        duration: formData?.duration,
      });

      setFormData({
        ...formData,
        urlVideo,
      });

      handleUpdateEditLessonId(null);
      handleUpdateShowBoundingBox(false);
    } else {
      setIsError(true);
    }
  };

  const isHasVideo = !!formData?.duration;

  return (
    <div
      className={classNames(
        'flex flex-col gap-3 border-1 border-t-0 border-white-15',
        isHasVideo ? 'px-0 py-0' : 'px-4 py-3'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-2 w-full">
          {/* {formData?.urlVideo && (
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
                <Text type="font-16-500" className="text-letter">
                  {valueProgress}%
                </Text>
              </div>
            </div>
          )} */}

          {!isHasVideo && (
            <div
              onClick={handleClickUploadFile}
              className={clsx(
                'cursor-pointer w-full py-3 px-[10px] bg-gray-800rounded border-1 border-white-20',
                {
                  ['!border-danger-300']: isError,
                }
              )}
            >
              <Text type="font-14-400" className="text-letter/40">
                {'No files selected'}
              </Text>
            </div>
          )}

          {isHasVideo && fileRef && (
            <Content
              info={{
                duration: formData?.duration,
                thumbnailUrl: formData?.blobThumbnailUrl,
                urlVideo: formData?.urlVideo,
                fileNameVideo: formData?.videoName,
              }}
              type={LessonContentType.VIDEO}
              handleClickEditContent={() => {
                fileRef.current?.click();
              }}
            />
          )}

          {isError && (
            <Text type="font-14-400" className="text-danger-300 px-2">
              {'Please upload the file'}
            </Text>
          )}
        </div>

        <input
          type="file"
          key={inputKey}
          ref={fileRef}
          accept=".mp4,.mov,.avi"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {!isHasVideo && (
          <Button
            isLoading={uploadFileLoading}
            onPress={handleClickUploadFile}
            className="bg-transparent min-h-[43px] min-w-[120px] border-1 border-main rounded"
          >
            <Text type="font-14-400" className="text-main">
              {'Select video'}
            </Text>
          </Button>
        )}
      </div>

      <Text
        type="font-12-500"
        className={classNames(
          'text-yellow-500 italic',
          isHasVideo ? 'px-2' : 'px-0'
        )}
      >
        {'Note: All files must be at least 720p and less than 100MB.'}
      </Text>

      <div
        className={classNames(
          'flex justify-end items-end',
          isHasVideo && 'mx-2 mb-2'
        )}
      >
        <Button
          onPress={handleClickSaveVideo}
          className="bg-main rounded h-[30px] min-w-[100px]"
        >
          <Text type="font-16-400" className="text-letter">
            {uploading ? <div>Progress: {progress}%</div> : 'Save'}
          </Text>
        </Button>
      </div>
    </div>
  );
};
export default FormAddVideo;

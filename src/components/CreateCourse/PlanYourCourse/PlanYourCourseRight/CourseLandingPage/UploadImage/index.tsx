import { useUploadFile } from '@/components/CreateCourse/service';
import LoadingScreen from '@/components/UI/LoadingScreen';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { Button, Progress, Spinner } from '@nextui-org/react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'next-i18next';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const UploadImage = ({ value, onChange }: { value: any; onChange: any }) => {
  const { t } = useTranslation('common');
  const fileInputRef: any = useRef(null);
  const [valueProgress, setValueProgress] = useState(0);
  const [inputKey, setInputKey] = useState(Date.now());

  const cropperRef: any = useRef(null);

  const [imageSrc, setImageSrc] = useState<string>('');

  console.log(value, 'value23');

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
      setImageSrc('');
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

    const img = new window.Image();

    img.onload = () => {
      const minWidth = 302;
      const minHeight = 200;
      console.log(img.width, 'width');

      if (img.width < minWidth || img.height < minHeight) {
        toast.error(
          t(
            `The uploaded image is too small. Minimum image size is 302x200px. Please upload a larger image.`
          )
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    };

    // Trigger the image loading
    img.src = URL.createObjectURL(file);
  };
  const handleClickUploadFile = () => {
    if (valueProgress === 100 && value) {
      setValueProgress(0);
      fileInputRef.current.value = null;
      setInputKey(Date.now());
    } else {
      fileInputRef.current.click();
    }
  };
  const getCropData = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current?.cropper;
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 302,
        height: 200,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      croppedCanvas.toBlob(async (blob: any) => {
        const file = new File([blob], 'cropped-image.jpg', {
          type: 'image/jpeg',
        });

        runUploadFile(file);
      }, 'image/png');
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
        <div className="relative md:min-w-[480px] h-[200px] bg-default flex items-center justify-center">
          {imageSrc ? (
            <div
              style={{ width: '100%', height: '200px', position: 'relative' }}
            >
              <Cropper
                ref={cropperRef}
                src={imageSrc}
                style={{ height: 200, width: '100%' }}
                aspectRatio={302 / 200}
                guides={true}
                cropBoxResizable={false}
                dragMode="move"
                zoomable={false}
                zoomOnWheel={false}
                zoomOnTouch={false}
                minCropBoxWidth={302}
                minCropBoxHeight={200}
              />
            </div>
          ) : (
            <Image
              src={value || '/img-default.png'}
              className="w-full md:w-[480px] h-[200px] object-contain"
              alt=""
              width={480}
              height={270}
            />
          )}

          {/* <Image
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
          )} */}
        </div>
        <div className="flex flex-col gap-3 md:gap-2">
          <Text type="font-16-600" className="text-white">
            {t(
              'Upload your course image here. It must meet our course image quality standards to be accepted. Important guidelines: 302x200 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.'
            )}
          </Text>
          <div className="flex items-center gap-2">
            {!imageSrc && (
              <>
                {valueProgress > 10 && value ? (
                  <div className="relative w-full">
                    <div className="flex items-center justify-center bg-[#02A6C2] p-3">
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
              </>
            )}

            {imageSrc ? (
              <Button
                isLoading={loading}
                onClick={getCropData}
                className="bg-transparent border-1 border-main min-w-[133px] min-h-[48px] rounded"
              >
                <Text type="font-16-700" className="text-main">
                  {'Crop image'}
                </Text>
              </Button>
            ) : (
              <Button
                onClick={handleClickUploadFile}
                className="bg-transparent border-1 border-main min-w-[133px] min-h-[48px] rounded"
              >
                <Text type="font-16-700" className="text-main">
                  {valueProgress > 10 && value ? t('Change') : t('Upload File')}
                </Text>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UploadImage;

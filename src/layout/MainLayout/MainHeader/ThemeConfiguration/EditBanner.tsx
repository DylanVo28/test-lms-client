import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useUploadFile } from '@/components/CreateCourse/service';

const EditBanner = ({ onChange, value }: any) => {
  const { t } = useTranslation('common');
  const [inputKey, setInputKey] = useState(Date.now());
  const fileInputRef: any = useRef(null);
  const cropperRef: any = useRef(null);

  const [imageSrc, setImageSrc] = useState<string>('');

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
    const minWidth = 1440;
    const minHeight = 410;

    img.onload = () => {
      if (img.width < minWidth || img.height < minHeight) {
        toast.error(
          t(`Image dimensions must be between ${minWidth}x${minHeight} pixels.`)
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
    if (value) {
      fileInputRef.current.value = null;
      setInputKey(Date.now());
      onChange('');
    } else {
      fileInputRef.current.click();
    }
  };

  const getCropData = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current?.cropper;
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 385,
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
    <div className="flex flex-col gap-4">
      <Text className="text-[18px] text-white font-semibold mb-[16px]">
        {t('Edit banner')}
      </Text>
      <input
        key={inputKey}
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="flex flex-col gap-6">
        <div className="relative w-full bg-gray-70 rounded">
          {imageSrc ? (
            <div
              style={{ width: '100%', height: '200px', position: 'relative' }}
            >
              <Cropper
                ref={cropperRef}
                src={imageSrc}
                style={{ height: 200, width: '100%' }}
                aspectRatio={385 / 200}
                guides={true}
                cropBoxResizable={false}
                dragMode="move"
                zoomable={false}
                zoomOnWheel={false}
                zoomOnTouch={false}
                minCropBoxWidth={385}
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
        <div className="flex items-center gap-2">
          {imageSrc ? (
            <Button
              isLoading={loading}
              onPress={getCropData}
              className="bg-transparent w-full border-1 border-main min-w-[133px] min-h-[48px] rounded"
            >
              <Text type="font-16-700" className="text-main">
                {'Crop image'}
              </Text>
            </Button>
          ) : (
            <Button
              onPress={handleClickUploadFile}
              className="bg-transparent w-full border-1 border-main min-w-[133px] min-h-[48px] rounded"
            >
              <Text type="font-16-700" className="text-main">
                {value ? t('Change') : t('Upload File')}
              </Text>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default EditBanner;

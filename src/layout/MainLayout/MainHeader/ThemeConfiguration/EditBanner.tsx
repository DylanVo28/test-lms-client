import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Fragment, useRef, useState } from 'react';

import { useUploadFile } from '@/components/CreateCourse/service';
import { CropperWrap } from '@/components/Commons/CropperWrap';

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
      // if (img.width < minWidth || img.height < minHeight) {
      //   toast.error(
      //     t(`Image dimensions must be between ${minWidth}x${minHeight} pixels.`)
      //   );
      //   return;
      // }

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
    fileInputRef.current.click();
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
      <Text className="text-[18px] text-white font-semibold mb-[4px]">
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
      <div className="flex flex-col gap-4">
        <div className="relative w-full bg-gray-70 rounded">
          <CropperWrap
            imageSrc={imageSrc}
            value={value}
            cropperRef={cropperRef}
            fallbackElement={
              <div>
                {!value && (
                  <div className="w-full box-border overflow-hidden h-[153px] flex flex-col items-center justify-center gap-[16px] bg-gray-70 rounded-[4px] ">
                    <div className="text-white">{t('JPEG, PNG or JPG')}</div>
                    <div className="relative">
                      <Button
                        onClick={handleClickUploadFile}
                        className="text-base font-semibold leading-[24px] capitalize w-[154px] h-[40px] px-[8px] rounded-[4px] bg-[#ffffff19] text-white border border-[var(--main-color)]"
                      >
                        {t('Choose file')}
                      </Button>
                    </div>
                  </div>
                )}

                {value && (
                  <Image
                    src={value || '/img-default.png'}
                    className="w-full md:w-[480px] h-auto"
                    alt=""
                    width={480}
                    height={270}
                  />
                )}
              </div>
            }
          />
        </div>
        <div className="flex items-center gap-2">
          {imageSrc ? (
            <Button
              isLoading={loading}
              onPress={getCropData}
              className="bg-[#16343B] w-full min-w-[133px] min-h-[44px] rounded"
            >
              <Text type="font-16-700" className="text-main">
                {'Crop image'}
              </Text>
            </Button>
          ) : (
            <Fragment>
              {value && (
                <Button
                  onPress={handleClickUploadFile}
                  className="bg-[#16343B] w-full min-w-[133px] min-h-[44px] rounded"
                >
                  <Text type="font-16-700" className="text-main">
                    {t('Change')}
                  </Text>
                </Button>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};
export default EditBanner;

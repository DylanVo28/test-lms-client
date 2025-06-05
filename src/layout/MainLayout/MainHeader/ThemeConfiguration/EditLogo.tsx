import { useUploadFile } from '@/components/CreateCourse/service';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { Button } from '@nextui-org/react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { CropperWrap } from '@/components/Commons/CropperWrap';

interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
}

const EditLogo = ({
  onChangeLogo,
  logo,
}: {
  onChangeLogo: (value: string) => void;
  logo: string;
}) => {
  const { t } = useTranslation('common');
  const [imageSrc, setImageSrc] = useState<string>('');
  const cropperRef: any = useRef(null);
  const fileInputRef: any = useRef(null);
  const [inputKey, setInputKey] = useState(Date.now());

  const { run, loading: loadingFile } = useUploadFile({
    onSuccess(response) {
      const data = response.data;
      onChangeLogo(data.url as string);
      toast.success(t('File uploaded successfully!'));
      setImageSrc('');
      // fileInputRef.current.value = null;
    },
    onError(error) {
      toast.error(t('File uploaded failed!'));
    },
  });
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10 MB
      const minWidth = 124;
      const minHeight = 46;
      const maxWidth = 3000;
      const maxHeight = 3000;

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          t('Invalid file type. Only JPEG, PNG, or JPG are allowed.')
        );
        return;
      }

      if (file.size > maxSize) {
        toast.error(t('File size exceeds 10 MB limit.'));
        return;
      }

      const img = new window.Image();

      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (
          img.width < minWidth ||
          img.height < minHeight ||
          img.width > maxWidth ||
          img.height > maxHeight
        ) {
          toast.error(
            t(
              `Image dimensions must be between ${minWidth}x${minHeight} and ${maxWidth}x${maxHeight} pixels.`
            )
          );
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
        // run(file);
      };
    }
  };
  const getCropData = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current?.cropper;
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 124,
        height: 46,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      croppedCanvas.toBlob(async (blob: any) => {
        const file = new File([blob], 'cropped-image.jpg', {
          type: 'image/jpeg',
        });

        run(file);
      }, 'image/png');
    }
  };

  const handleClickUploadFile = () => {
    fileInputRef.current.click();
  };
  return (
    <div>
      <input
        type="file"
        key={inputKey}
        ref={fileInputRef}
        onChange={onChangeFile}
        style={{ display: 'none' }}
        accept="image/jpeg, image/png, image/jpg"
      />
      <Text className="text-[18px] text-white font-semibold mb-[16px]">
        {t('Edit logo')}
      </Text>
      {/* <p className="text-md text-white mb-[8px]">
        {t('Minimum 124x46 pixels, Maximum 3000x3000 pixels')}
      </p> */}
      <div className="flex flex-col gap-4">
        <div className="">
          <CropperWrap
            imageSrc={imageSrc}
            value={logo}
            cropperRef={cropperRef}
            fallbackElement={
              <>
                {logo ? (
                  <div className="min-h-[100px] bg-gray-70 rounded-md flex justify-center items-center">
                    <Image src={logo} alt="" width={124} height={46} />
                  </div>
                ) : (
                  <div className="w-full box-border overflow-hidden h-[153px] flex flex-col items-center justify-center gap-[16px] bg-gray-70 rounded-[4px] ">
                    <div className="text-white">{t('JPEG, PNG or JPG.')}</div>
                    <div className="relative">
                      <Button
                        onClick={handleClickUploadFile}
                        isLoading={loadingFile}
                        className="text-base font-semibold leading-[24px] capitalize w-[154px] h-[40px] px-[8px] rounded-[4px] bg-[#ffffff19] text-white border border-[var(--main-color)]"
                      >
                        {t('Choose file')}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            }
          />
        </div>
        {imageSrc ? (
          <Button
            onClick={getCropData}
            className="rounded-[4px] font-bold text-base text-main bg-[#16343B] h-[44px]"
          >
            {'Crop image'}
          </Button>
        ) : (
          <Button
            onClick={handleClickUploadFile}
            className="rounded-[4px] font-bold text-base text-main bg-[#16343B] h-[44px]"
          >
            {t('Change')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditLogo;

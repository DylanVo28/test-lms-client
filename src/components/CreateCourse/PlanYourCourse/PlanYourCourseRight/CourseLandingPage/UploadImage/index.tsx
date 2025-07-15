import { useUploadFile } from '@/components/CreateCourse/service';
import LoadingScreen from '@/components/UI/LoadingScreen';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { Button, Progress, Spinner } from '@nextui-org/react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import React from 'react';
import { CropperWrap } from '@/components/Commons/CropperWrap';
import useClickOutside from '@/hooks/useClickOutside';

const UploadImage = ({
  value,
  onChange,
  error,
}: {
  value: any;
  onChange: any;
  error: any;
}) => {
  const fileInputRef: any = useRef(null);
  const [valueProgress, setValueProgress] = useState(0);
  const [inputKey, setInputKey] = useState(Date.now());

  const cropperRef: any = useRef(null);

  const [imageSrc, setImageSrc] = useState<string>('');

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
      toast.error('Can only upload files in .jpg, .jpeg, .gif or .png format');
      return;
    }

    const img = new window.Image();

    img.onload = () => {
      const minWidth = 200;
      const minHeight = 150;

      if (img.width < minWidth || img.height < minHeight) {
        toast.error(
          `The uploaded image is too small. Minimum image size is 302x200px. Please upload a larger image.`
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
    fileInputRef.current.click();
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
        {'Course image'}
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
        <div className="relative md:w-[240px] w-full h-[180px] bg-default flex items-center justify-center">
          <CropperWrap
            imageSrc={imageSrc}
            value={value}
            cropperRef={cropperRef}
            fallbackElement={
              <Image
                src={value || '/img-default.png'}
                className="w-full md:w-[240px] h-[200px] object-contain"
                alt=""
                width={240}
                height={180}
              />
            }
          />
        </div>
        <div className="flex flex-col gap-3 md:gap-2 flex-1">
          <Text type="font-16-600" className="text-white">
            Upload your course image here. It must be 302x200 pixels, in .jpg,
            .jpeg, .gif, or .png format, and contain no text.
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
                      {'No file selected'}
                    </Text>
                  </div>
                )}
              </>
            )}

            {imageSrc ? (
              <Button
                isLoading={loading}
                onPress={getCropData}
                className="bg-transparent border-1 border-main min-w-[133px] min-h-[48px] rounded"
              >
                <Text type="font-16-700" className="text-main">
                  {'Crop image'}
                </Text>
              </Button>
            ) : (
              <Button
                onPress={handleClickUploadFile}
                className="bg-transparent border-1 border-main min-w-[133px] min-h-[48px] rounded"
              >
                <Text type="font-16-700" className="text-main">
                  {valueProgress > 10 && value ? 'Change' : 'Upload File'}
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
export default UploadImage;

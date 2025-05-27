import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { useUploadFile } from '../CreateCourse/service';
import { toast } from '../UI/Toast/toast';
import { userRequest, TUser } from './service';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useProfile } from '@/store/profile/useProfile';

interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
}

const Avatar = ({ reload }: { reload: VoidFunction }) => {
  const { t } = useTranslation('common');
  const [valueFile, setValueFile] = useState<UploadedFile>();
  const [loading, setLoading] = useState(false);
  const { profile } = useProfile();
  const { run, loading: loadingFile } = useUploadFile({
    onSuccess(response) {
      const data = response.data;
      setValueFile(data);
      toast.success(t('File uploaded successfully!'));
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
      const minWidth = 200;
      const minHeight = 200;
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

        run(file);
      };
    }
  };

  const onSave = async () => {
    if (!valueFile?.url) return;
    try {
      setLoading(true);

      await userRequest.update({ ...profile, avatar: valueFile.url });
      reload();
      setValueFile(undefined);
      toast.success(t('Avatar uploaded successfully!'));
    } catch (error) {
      toast.error(t('Avatar uploaded failed!'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="text-[18px] font-bold">
        <sup className="text-[#FF3132]">*</sup> {t('Upload File')}
      </div>

      {/* <div className="text-white">
        {t('Minimum 124x46 pixels, Maximum 3000x3000 pixels')}
      </div> */}

      <div className="p-[20px] h-[180px] w-fit bg-gray-50 rounded-[4px]">
        <div className="relative h-full aspect-square bg-gray-70 border border-dashed rounded-[4px] border-[#32383E] flex flex-col justify-center items-center gap-[16px]">
          {valueFile?.url && (
            <Image
              src={valueFile.url ?? ''}
              alt="avatar"
              className="w-[60px] h-[60px]"
              width={60}
              height={60}
            />
          )}
          <Button
            isLoading={loadingFile}
            className="px-[20px] py-[10px] bg-[#ffffff19] rounded-[4px] text-main border border-[var(--main-color)]"
          >
            {t('Choose File')}
          </Button>
          {!loading && (
            <input
              className="w-full h-full absolute top-0 opacity-0 cursor-pointer"
              type="file"
              onChange={onChangeFile}
            />
          )}
        </div>
      </div>

      <Button
        isDisabled={!valueFile}
        onPress={onSave}
        isLoading={loading}
        type="button"
        className="w-fit px-[24px] bg-main text-text-white font-semibold py-[10px] rounded-[4px] hover:bg-cyan-400 transition"
      >
        {t('Save Profile')}
      </Button>
    </div>
  );
};

export default Avatar;

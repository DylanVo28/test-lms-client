import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { useUploadFile } from '../CreateCourse/service';
import { toast } from '../UI/Toast/toast';
import { userRequest, TUser } from './service';

interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
}

const Avatar = ({ user, reload }: { user?: TUser; reload: VoidFunction }) => {
  const [valueFile, setValueFile] = useState<UploadedFile>();
  const [loading, setLoading] = useState(false);
  const { run, loading: loadingFile } = useUploadFile({
    onSuccess(response) {
      const data = response.data;
      setValueFile(data);
      toast.success(`File uploaded successfully!`);
    },
    onError(error) {
      toast.error('File uploaded failed!');
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
        toast.error('Invalid file type. Only JPEG, PNG, or JPG are allowed.');
        return;
      }

      if (file.size > maxSize) {
        toast.error('File size exceeds 10 MB limit.');
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (
          img.width < minWidth ||
          img.height < minHeight ||
          img.width > maxWidth ||
          img.height > maxHeight
        ) {
          toast.error(
            `Image dimensions must be between ${minWidth}x${minHeight} and ${maxWidth}x${maxHeight} pixels.`
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
      await userRequest.update({ ...user, avatar: valueFile.url });
      reload();
      toast.success('Avatar uploaded successful!');
    } catch (error) {
      toast.error('Avatar uploaded failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="text-[18px] font-bold">
        <sup className="text-[#FF3132]">*</sup> Upload File
      </div>

      <div className="opacity-50">
        Minimum 200x200 pixels, Maximum 3000x3000 pixels
      </div>

      <div className="p-[20px] h-[241px] bg-[#32383E] w-full rounded-[4px]">
        <div className="relative w-full h-full bg-[#181F25] border border-dashed rounded-[4px] border-[#32383E] flex flex-col justify-center items-center gap-[16px]">
          <div className="text-[#ffffff7f]">
            {valueFile?.filename || 'JPEG, PNG or JPG . Max 10mb.'}
          </div>
          <Button
            isLoading={loadingFile}
            className="px-[20px] py-[10px] bg-[#ffffff19] rounded-[4px] border border-[var(--main-color)]"
          >
            Choose File
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
        onClick={onSave}
        isLoading={loading}
        type="button"
        className="w-fit px-[24px] bg-main text-white font-semibold py-[10px] rounded-[4px] hover:bg-cyan-400 transition"
      >
        Save Profile
      </Button>
    </div>
  );
};

export default Avatar;

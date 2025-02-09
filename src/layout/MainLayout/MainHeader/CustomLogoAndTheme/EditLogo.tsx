import { useUploadFile } from '@/components/CreateCourse/service';
import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { Button } from '@nextui-org/react';
import React, { useState } from 'react';

interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
}

const EditLogo = ({
  onChangeLogo,
}: {
  onChangeLogo: (value: string) => void;
}) => {
  const [valueFile, setValueFile] = useState<UploadedFile>();
  const { run, loading: loadingFile } = useUploadFile({
    onSuccess(response) {
      const data = response.data;
      setValueFile(data);
      onChangeLogo(data.url as string);
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
  return (
    <div>
      <Text className="text-[18px] font-semibold mb-[16px]">Edit logo</Text>
      <p className="text-md text-[#ffffff7f] mb-[8px]">
        Minimum 200x200 pixels, Maximum 3000x3000 pixels
      </p>
      <div className="p-[20px] bg-[#242A30] rounded-[4px] border border-[#00000033]">
        <div className="w-full box-border overflow-hidden h-[153px] flex flex-col items-center justify-center gap-[16px] bg-[#181F25] rounded-[4px] ">
          <div className="text-[#ffffff7f]">
            {valueFile?.filename || 'JPEG, PNG or JPG . Max 10mb.'}
          </div>
          <div className="relative">
            <Button
              isLoading={loadingFile}
              className="text-base font-semibold leading-[24px] capitalize w-[154px] h-[40px] px-[8px] rounded-[4px] bg-[#ffffff19] text-white border border-[#02A6C2]"
            >
              Choose file
            </Button>
            <input
              type="file"
              onChange={onChangeFile}
              className="absolute top-0 w-full h-full left-0 opacity-0 cursor-pointer"
              accept="image/jpeg, image/png, image/jpg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLogo;

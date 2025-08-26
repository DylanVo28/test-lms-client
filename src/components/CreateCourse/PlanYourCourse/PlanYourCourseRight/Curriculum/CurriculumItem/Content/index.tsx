import Text from '@/components/UI/Text';
import { LessonContentType } from '@/utils/const';
import { File, FileText } from '@/components/UI/Icons/FileIcons';
import Image from 'next/image';
import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';

const Content = ({
  handleClickEditContent,
  type,
  info,
}: {
  handleClickEditContent?: VoidFunction;
  type: LessonContentType;
  info: any;
}) => {
  const { t } = useTranslation('common');
  const formattedTime: string = useMemo(() => {
    const minutes = Math.floor(info?.duration / 60);
    const seconds = Math.floor(info?.duration % 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

    return formattedTime;
  }, [info?.duration]);

  return (
    <div className="flex items-start justify-between p-3  border-1 border-t-0 border-white-15 gap-3">
      <div className="flex items-center gap-2 cursor-pointer">
        {info?.thumbnailUrl ? (
          <Image
            alt=""
            width={116}
            height={65}
            className="object-cover"
            src={info?.thumbnailUrl}
          />
        ) : (
          <div className="w-[116px] h-[65px] bg-black-10 flex justify-center items-center">
            <FileText size={30} weight="light" />
          </div>
        )}

        <div className="flex flex-col gap-1">
          {info?.fileNameVideo && (
            <Text type="font-14-700" className="text-letter line-clamp-1">
              {info?.fileNameVideo}
            </Text>
          )}
          {info?.duration && (
            <Text type="font-14-400" className="text-letter">
              {formattedTime}
            </Text>
          )}

          {handleClickEditContent && (
            <div
              onClick={handleClickEditContent}
              className="flex items-center gap-1"
            >
              <IconEdit />
              <Text type="font-14-400" className="text-[#0059FF]">
                {type === LessonContentType.VIDEO
                  ? t('createCourse.curriculum.editVideo')
                  : t('createCourse.curriculum.editContent')}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Content;

const IconEdit = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M10.75 5.71507L14.285 9.2509L6.035 17.5001H2.5V13.9642L10.75 5.71424V5.71507ZM11.9283 4.53674L13.6958 2.7684C13.8521 2.61218 14.064 2.52441 14.285 2.52441C14.506 2.52441 14.7179 2.61218 14.8742 2.7684L17.2317 5.1259C17.3879 5.28218 17.4757 5.4941 17.4757 5.71507C17.4757 5.93604 17.3879 6.14796 17.2317 6.30424L15.4633 8.07174L11.9283 4.53674Z"
        fill="#0059FF"
      />
    </svg>
  );
};

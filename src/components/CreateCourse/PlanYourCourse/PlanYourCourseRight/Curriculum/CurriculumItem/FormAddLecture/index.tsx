import Text from '@/components/UI/Text';
import { LessonContentType, TYPE_COURSE } from '@/utils/const';
import { File, PlayCircle } from '@/components/UI/Icons/FileIcons';
import { useEffect, useState } from 'react';
import FormAddArticle from '../FormAddArticle';
import FormAddVideo from '../FormAddVideo';
const FormAddLecture = ({
  handleSaveArticle,
  loading,
  handleSaveVideo,
  typeAddContent,
  valueContent,
  valueInfo,
  lectureItem,
}: {
  handleSaveArticle: (value: string) => void;
  handleSaveVideo: (info: any) => void;
  loading: boolean;
  valueContent?: string;
  typeAddContent: string;
  valueInfo: any;
  lectureItem: any;
}) => {
  const [typeAddAction, setTypeAddAction] = useState<string>('');

  const handleClickArticle = () => {
    setTypeAddAction(LessonContentType.ARTICLE);
  };

  const handleClickVideo = () => {
    setTypeAddAction(LessonContentType.VIDEO);
  };

  useEffect(() => {
    if (typeAddContent === LessonContentType.ARTICLE && valueContent) {
      setTypeAddAction(LessonContentType.ARTICLE);
    } else {
      if (valueContent || valueInfo?.duration) {
        setTypeAddAction(LessonContentType.VIDEO);
      } else {
        setTypeAddAction('');
      }
    }
  }, [typeAddContent, valueContent, valueInfo?.duration]);
  return (
    <>
      {typeAddAction ? (
        <>
          {typeAddAction === LessonContentType.ARTICLE && (
            <FormAddArticle
              valueContent={valueContent}
              loading={loading}
              handleSaveArticle={(value) => handleSaveArticle(value)}
            />
          )}
          {typeAddAction === LessonContentType.VIDEO && (
            <FormAddVideo
              valueInfo={valueInfo}
              handleSaveVideo={handleSaveVideo}
              lectureItem={lectureItem}
            />
          )}
        </>
      ) : (
        <div className="flex text-center justify-center py-3 flex-col border-1 border-t-0 border-white-15 items-center gap-3">
          <Text className="text-letter/70 px-20" type="font-14-400">
            Select the primary content type. Files and links can be added as
            resources. Learn about content types.
          </Text>
          <div className="flex items-center gap-6">
            <div
              onClick={handleClickVideo}
              className="flex hover:opacity-80 transition-all flex-col cursor-pointer items-center border-1 border-white-20 min-w-[70px]"
            >
              <div className="border-b w-full items-center justify-center flex py-2 border-b-white-20">
                <PlayCircle size={32} color="#8C8C8C" />
              </div>

              <div className="p-2 bg-slate-600 w-full text-center">
                <Text>{'Video'}</Text>
              </div>
            </div>
            <div
              onClick={handleClickArticle}
              className="flex transition-all hover:opacity-80 flex-col cursor-pointer items-center border-1 border-white-20 min-w-[70px]"
            >
              <div className="border-b w-full items-center justify-center flex py-2 border-b-white-20">
                <File size={32} color="#8C8C8C" />
              </div>

              <div className="p-2 bg-slate-600 w-full text-center">
                <Text>{'Article'}</Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormAddLecture;

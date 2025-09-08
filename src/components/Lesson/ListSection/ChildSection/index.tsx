import Text from '@/components/UI/Text';
import { UserCourseProgressStatus } from '@/utils/common';
import { LessonContentType, TYPE_COURSE } from '@/utils/const';
import { Checkbox } from '@nextui-org/react';
import {
  File,
  FileText,
  PlayCircle,
  Question,
} from '@/components/UI/Icons/FileIcons';
import clsx from 'clsx';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
export const activeItemSectionAtom = atom<string>('');

const ChildSection = ({
  items,
  handleClickChildLesson,
  onChangeCheckBox,
}: {
  items: any;
  handleClickChildLesson: (
    id: string,
    type: TYPE_COURSE,
    status: UserCourseProgressStatus
  ) => void;
  onChangeCheckBox: (values: any) => void;
}) => {
  const router = useRouter();

  const [activeItemSection, setActiveItemSection] = useAtom(
    activeItemSectionAtom
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        {items?.map((item: any, index: number) => {
          const minutes = Math.floor(item?.info?.duration / 60);
          const seconds = Math.floor(item?.info?.duration % 60);
          const formattedTime = `${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

          return (
            <div
              key={item?.id}
              onClick={() => {
                if (item?.type === TYPE_COURSE.QUIZ) {
                  localStorage.setItem('titleQuizz', `Quizz ${item?.sttQuizz}`);
                }
                setActiveItemSection(item?.id);
                handleClickChildLesson(
                  item?.id,
                  item?.type,
                  item?.progress?.status
                );
              }}
              className={clsx(
                'flex flex-col gap-3 px-4 py-3 cursor-pointer min-h-[50px] justify-center border-b-1 border-b-black-9 hover:bg-main-60  transition-all',
                {
                  ['bg-main-60']: item?.id === activeItemSection,
                }
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  radius="sm"
                  onChange={() => onChangeCheckBox(item)}
                  isSelected={
                    item?.progress?.status ===
                    UserCourseProgressStatus?.COMPLETED
                  }
                  classNames={{
                    wrapper: 'after:!bg-main before:!border-black-7',
                  }}
                />
                {item?.type === TYPE_COURSE.QUIZ ? (
                  <Text type="font-16-600" className="text-letter mt-[-4px]">
                    {`Quizz ${item?.sttQuizz}. ${item?.title}`}
                  </Text>
                ) : (
                  <>
                    {item?.type === TYPE_COURSE?.END_COURSE ? (
                      <Text
                        type="font-16-600"
                        className="text-letter mt-[-4px]"
                      >
                        {'End of course'}
                      </Text>
                    ) : (
                      <Text
                        type="font-16-600"
                        className="text-letter mt-[-4px]"
                      >
                        {`${index + 1}. ${item?.title}`}
                      </Text>
                    )}
                  </>
                )}
              </div>

              {item?.type === TYPE_COURSE.LECTURE && (
                <>
                  {item.contentType === LessonContentType.VIDEO && (
                    <div className="flex items-center gap-2">
                      <>
                        <PlayCircle size={20} className="text-black-5" />
                        <Text type="font-14-400" className="text-black-5">
                          {formattedTime}
                        </Text>
                      </>
                    </div>
                  )}

                  {item.contentType === LessonContentType.ARTICLE && (
                    <div className="flex items-center gap-2">
                      <>
                        <FileText size={20} className="text-black-5" />
                        <Text type="font-14-400" className="text-black-5">
                          {item?.content && (
                            <>
                              {Math.ceil(
                                item.content
                                  .replace(/<[^>]*>/g, '')
                                  .replace(/data:image\/[^;]+;base64[^"]+/g, '')
                                  .trim()
                                  .split(/\s+/).length / 200
                              )}
                              min
                            </>
                          )}
                        </Text>
                      </>
                    </div>
                  )}
                </>
              )}

              {item.type === LessonContentType.QUIZ && (
                <div className="flex items-center gap-2">
                  <>
                    <Question size={20} className="text-black-5" />
                    <Text type="font-14-400" className="text-black-5">
                      Quizz
                    </Text>
                  </>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ChildSection;

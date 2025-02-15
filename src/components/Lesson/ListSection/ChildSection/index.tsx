import Text from '@/components/UI/Text';
import { UserCourseProgressStatus } from '@/utils/common';
import { TYPE_COURSE } from '@/utils/const';
import { Checkbox } from '@nextui-org/react';
import { File, MonitorPlay } from '@phosphor-icons/react';
import clsx from 'clsx';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation('common');
  const router = useRouter();

  const [activeItemSection, setActiveItemSection] = useAtom(
    activeItemSectionAtom
  );

  console.log(activeItemSection, 'activeItemSection');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        {items?.map((item: any, index: number) => {
          console.log(item, 'item');

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
                  <Text type="font-16-600" className="text-white mt-[-4px]">
                    {t('Quizz {{sttQuizz}}. {{title}}', {
                      sttQuizz: item?.sttQuizz,
                      title: item?.title,
                    })}
                  </Text>
                ) : (
                  <>
                    {item?.type === TYPE_COURSE?.END_COURSE ? (
                      <Text type="font-16-600" className="text-white mt-[-4px]">
                        {t('End of course')}
                      </Text>
                    ) : (
                      <Text type="font-16-600" className="text-white mt-[-4px]">
                        {`${index + 1}. ${item?.title}`}
                      </Text>
                    )}
                  </>
                )}
              </div>
              {item?.type === TYPE_COURSE.LECTURE && (
                <div className="flex items-center gap-2">
                  {item?.info?.duration ? (
                    <>
                      <MonitorPlay size={20} className="text-black-5" />
                      <Text type="font-14-400" className="text-black-5">
                        {formattedTime}
                      </Text>
                    </>
                  ) : (
                    <>
                      <File size={20} className="text-black-5" />
                      <Text type="font-14-400" className="text-black-5">
                        {t('0 min')}
                      </Text>
                    </>
                  )}
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

import Text from '@/components/UI/Text';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import IconCourse from '@/components/UI/Icons/IconCourse';
import { useAtom } from 'jotai';
import { totalStepAtom } from '../HeaderCourse';

export const enum TYPE_CREATE_COURSE {
  COURSE = 'COURSE',
  PREMADE_CONTENT = 'PREMADE_CONTENT',
}

const DATA_CONTENT = [
  {
    id: 'COURSE',
    label: 'Courses',
    img: '/images/img-courses.png',
    description:
      'Create rich learning experiences with the help of video lectures, quizzes, programming exercises, and more.',
  },
  {
    id: 'PREMADE_CONTENT',
    label: 'Premade Content',
    img: '/images/img-practice.png',
    description:
      'Allows the content creator to just duplicate from our white label database',
  },
];

const ContenStep1 = ({ control }: { control: Control }) => {
  const { t } = useTranslation('common');
  const [, setTotalStep] = useAtom(totalStepAtom);

  return (
    <div className="flex items-center flex-col gap-10">
      <Text className="text-white text-center" type="font-32-700">
        {t("First, let's find out what type of course you're making.")}
      </Text>
      <Controller
        name="type"
        control={control}
        defaultValue={'COURSE'}
        render={({ field }) => (
          <div className="flex md:flex-row flex-col items-center gap-6">
            {DATA_CONTENT?.map((item) => {
              return (
                <div
                  key={item?.id}
                  onClick={() => {
                    if (item?.id === TYPE_CREATE_COURSE.PREMADE_CONTENT) {
                      setTotalStep(2);
                    } else {
                      setTotalStep(4);
                    }
                    field.onChange(item?.id);
                  }}
                  className={clsx(
                    'py-5 px-4 w-[302px] cursor-pointer transition-all items-center text-center min-h-[214px] bg-white-10 border-1 border-white-10 rounded flex flex-col gap-3',
                    {
                      ['!bg-[#02a6c233] !border-[#02A6C2]']:
                        field.value == item?.id,
                    }
                  )}
                >
                  <IconCourse />
                  {/* <Image alt="" width={48} height={48} src={item?.img} /> */}
                  <Text type="font-20-700" className="text-white">
                    {t(item?.label)}
                  </Text>
                  <Text type="font-16-400" className="text-black-6">
                    {t(item?.description)}
                  </Text>
                </div>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};
export default ContenStep1;

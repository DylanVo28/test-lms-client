import Text from '@/components/UI/Text';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import IconCourse from '@/components/UI/Icons/IconCourse';
import { useAtom } from 'jotai';
import { totalStepAtom } from '../HeaderCourse';
import { useTranslation } from 'next-i18next';

export const enum TYPE_CREATE_COURSE {
  COURSE = 'COURSE',
  PREMADE_CONTENT = 'PREMADE_CONTENT',
}

const ContenStep1 = ({ control }: { control: Control }) => {
  const [, setTotalStep] = useAtom(totalStepAtom);
  const { t } = useTranslation('common');

  const DATA_CONTENT = [
    {
      id: 'COURSE',
      label: t('createCourse.courseType'),
      img: '/images/img-courses.png',
      description: t('createCourse.courseTypeDescription'),
    },
    {
      id: 'PREMADE_CONTENT',
      label: t('createCourse.premadeContent'),
      img: '/images/img-practice.png',
      description: t('createCourse.premadeContentDescription'),
    },
  ];

  return (
    <div className="flex items-center flex-col gap-10">
      <Text className="text-letter text-center" type="font-28-700">
        {t('createCourse.findOutType')}
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
                    'py-5 px-4 w-[302px] cursor-pointer transition-all items-center text-center min-h-[214px] bg-card border-1 border-white-10 rounded flex flex-col gap-3',
                    {
                      ['!bg-[#02a6c233] !border-[#02A6C2]']:
                        field.value == item?.id,
                    }
                  )}
                >
                  <IconCourse />
                  {/* <Image alt="" width={48} height={48} src={item?.img} /> */}
                  <Text type="font-20-700" className="text-letter">
                    {item?.label}
                  </Text>
                  <Text type="font-16-400" className="text-letter/70">
                    {item?.description}
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

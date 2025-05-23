import { useGetListCourse } from '@/components/Course/ListCourse/service';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { useProfile } from '@/store/profile/useProfile';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';

const ContenStepDuplicateCourse = ({ control }: { control: Control }) => {
  const { t } = useTranslation('common');

  const { dataCourses, reload } = useGetListCourse({
    pageSize: 50,
    order: 'createdAt asc',
    // authors: dataThemeConfig?.kolId,
  });

  useEffect(() => {
    reload();
  }, []);

  return (
    <div className="flex flex-col gap-10 items-center text-center">
      <div className="flex flex-col gap-3">
        <Text type="font-28-700" className="text-white">
          {t('Courses')}
        </Text>
      </div>
      <div className="w-full">
        <Controller
          name="courseId"
          control={control}
          render={({ field }) => (
            <SelectCustom
              placeholder={t('Choose courses')}
              className="md:min-w-[620px]"
              isSelectSubmit
              onChange={field.onChange}
              value={field.value}
              options={
                dataCourses?.map((item: any) => {
                  return {
                    key: item?.id,
                    label: item?.title,
                  };
                }) || []
              }
            />
          )}
        />
      </div>
    </div>
  );
};
export default ContenStepDuplicateCourse;

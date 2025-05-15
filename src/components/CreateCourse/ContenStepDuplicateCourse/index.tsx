import InputText from '@/components/UI/InputText';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { Control, Controller } from 'react-hook-form';
import { useGetCategories } from '../service';
import { useTranslation } from 'next-i18next';
import { useGetListCourse } from '@/components/Course/ListCourse/service';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import { useEffect } from 'react';

const ContenStepDuplicateCourse = ({ control }: { control: Control }) => {
  const { t } = useTranslation('common');
  const { theme: dataThemeConfig } = useThemeInitial();

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

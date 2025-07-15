import { useGetListCourse } from '@/components/Course/ListCourse/service';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { useProfile } from '@/store/profile/useProfile';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import { useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';

const ContenStepDuplicateCourse = ({ control }: { control: Control }) => {
  const { theme: dataThemeConfig } = useThemeInitial();

  const { dataCourses, reload } = useGetListCourse({
    pageSize: 50,
    order: 'createdAt asc',
    authors: dataThemeConfig?.adminId,
  });

  useEffect(() => {
    reload();
  }, []);

  return (
    <div className="flex flex-col gap-10 items-center text-center">
      <div className="flex flex-col gap-3">
        <Text type="font-28-700" className="text-white">
          {'Courses'}
        </Text>
      </div>
      <div className="w-full">
        <Controller
          name="courseId"
          control={control}
          render={({ field }) => (
            <SelectCustom
              placeholder={'Choose courses'}
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

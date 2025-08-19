import InputText from '@/components/UI/InputText';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useGetCategories } from '../service';
const ContenStep3 = ({ control }: { control: Control }) => {
  const { dataCategories } = useGetCategories({ order: 'createdAt asc' });
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col gap-10 items-center text-center">
      <div className="flex flex-col gap-3">
        <Text type="font-28-700" className="text-letter">
          {t('createCourse.categoryQuestion')}
        </Text>
        <Text type="font-16-400" className="text-letter/70">
          {t('createCourse.categoryDescription')}
        </Text>
      </div>
      <div className="w-full">
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <SelectCustom
              placeholder={t('createCourse.chooseCategoryPlaceholder')}
              className="md:min-w-[620px]"
              isSelectSubmit
              onChange={field.onChange}
              value={field.value}
              options={
                dataCategories?.data?.map((item: any) => {
                  return {
                    key: item?.id,
                    label: item?.name,
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
export default ContenStep3;

import InputText from '@/components/UI/InputText';
import QuillEditor from '@/components/UI/QuillEditor';
import SelectCustom from '@/components/UI/SelectCustom';
import Text from '@/components/UI/Text';
import { Control, Controller } from 'react-hook-form';
import UploadImage from './UploadImage';
import PromotionalVideo from './PromotionalVideo';
import { DATA_LANGUAGE, DATA_LEVEL } from '@/utils/const';
import {
  useGetCategories,
  useGetLanguages,
  useGetLevels,
  useGetTopics,
} from '@/services/filter.service';
import { useGetSubCategories } from '@/components/CreateCourse/service';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
const CourseLandingPage = ({
  control,
  watch,
  validationErrors,
}: {
  control: Control;
  watch: any;
  validationErrors?: any;
}) => {
  const { t } = useTranslation('common');
  const { data } = useGetCategories({ order: 'createdAt asc' });
  const { data: levels } = useGetLevels();
  const { data: languages } = useGetLanguages();
  const { data: topics } = useGetTopics();
  const { dataSubCategories, run: runGetSubCategories } = useGetSubCategories();
  const watchCategories = watch('categoryId');

  useEffect(() => {
    if (watchCategories) {
      runGetSubCategories(watchCategories);
    }
  }, [watchCategories]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Text type="font-28-700" className="text-letter">
          {t('createCourse.curriculum.landingPage.title')}
        </Text>
        <Text type="font-16-400" className="text-letter/70">
          {t('createCourse.curriculum.landingPage.description')}
        </Text>
      </div>
      <div className="flex flex-col gap-1">
        <Controller
          name="title"
          control={control}
          rules={{
            required: 'Field course title is required',
          }}
          render={({ field, fieldState }) => (
            <InputText
              required
              value={field.value}
              error={fieldState?.error?.message}
              onChange={field.onChange}
              maxLength={160}
              label={t('createCourse.curriculum.landingPage.courseTitle')}
              placeholder={'From Beginner to Expert'}
              inputDefault
              classInputWrapper={
                validationErrors?.courseLandingPage &&
                (!field.value || !field.value.trim())
                  ? '!border-red-500'
                  : ''
              }
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Controller
          name="subtitle"
          control={control}
          rules={{
            required: 'Field course subtitle is required',
          }}
          render={({ field, fieldState }) => (
            <InputText
              value={field.value}
              onChange={field.onChange}
              maxLength={160}
              label={t('createCourse.curriculum.landingPage.courseSubtitle')}
              placeholder={'Everything You Need to Know to Get Started'}
              inputDefault
              error={fieldState?.error?.message}
              classInputWrapper={
                validationErrors?.courseLandingPage &&
                (!field.value || !field.value.trim())
                  ? '!border-red-500'
                  : ''
              }
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Controller
          name="description"
          control={control}
          rules={{
            required: 'Field course description is required',
            minLength: {
              value: 200,
              message:
                'Field course description must be at least 200 characters',
            },
          }}
          render={({ field, fieldState }) => (
            <QuillEditor
              placeholder="Are you ready to master [Topic]? This comprehensive course will take you from beginner to expert, covering everything you need to know step by step..."
              onChange={field.onChange}
              value={field.value}
              label={t('createCourse.curriculum.landingPage.courseDescription')}
              inputDefault
              error={fieldState?.error?.message}
            />
          )}
        />
        {/* <Text type="font-12-400" className="text-letter/70">
          {'Description should have minimum 200 words.'}
        </Text> */}
      </div>
      <div className="flex flex-col gap-3">
        <Text type="font-16-600" className="text-letter">
          {t('createCourse.curriculum.landingPage.basicInfo')}
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Controller
            name="lang"
            control={control}
            rules={{
              required: 'Field language is required',
            }}
            render={({ field, fieldState }) => (
              <SelectCustom
                placeholder={'Select language'}
                className="min-w-[120px]"
                onChange={field.onChange}
                value={field.value}
                inputDefault
                error={fieldState?.error?.message}
                hasError={validationErrors?.courseLandingPage && !field.value}
                options={
                  languages?.data?.map((item: any) => {
                    return {
                      key: item?.value,
                      label: item?.label,
                    };
                  }) || []
                }
              />
            )}
          />

          <Controller
            name="level"
            control={control}
            rules={{
              required: 'Field level is required',
            }}
            render={({ field, fieldState }) => (
              <SelectCustom
                placeholder={'-- Select level --'}
                className="min-w-[120px]"
                onChange={field.onChange}
                value={field.value}
                inputDefault
                hasError={validationErrors?.courseLandingPage && !field.value}
                options={
                  levels?.data?.map((item: any) => {
                    return {
                      key: item?.value,
                      label: item?.label,
                    };
                  }) || []
                }
                error={fieldState?.error?.message}
              />
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Controller
            name="categoryId"
            control={control}
            rules={{
              required: 'Field category is required',
            }}
            render={({ field, fieldState }) => (
              <SelectCustom
                placeholder={'Developer'}
                inputDefault
                onChange={field.onChange}
                value={field.value}
                className="min-w-[120px]"
                error={fieldState?.error?.message}
                hasError={validationErrors?.courseLandingPage && !field.value}
                options={
                  data?.data?.map((item: any) => {
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
        <Text type="font-12-400" className="text-letter/70">
          Use 1 or 2 related keywords, and mention 3-4 of the most important
          areas that you have covered during your course.
        </Text>
      </div>
      {/* <div className="grid md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <Controller
            name="topics"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Text type="font-16-600" className="text-letter mb-3">
                  {t('createCourse.curriculum.landingPage.primaryTaught')}
                </Text>
                <SelectCustom
                  placeholder={'e.g Landscape Photography'}
                  className="min-w-[120px]"
                  onChange={field.onChange}
                  value={field.value}
                  inputDefault
                  error={fieldState?.error?.message}
                  options={
                    topics?.data?.map((item: any) => {
                      return {
                        key: item?.value,
                        label: item?.label,
                      };
                    }) || []
                  }
                />
              </>
            )}
          />
        </div>
      </div> */}
      <Controller
        name="image"
        control={control}
        rules={{
          required: 'Please upload an image, this helps your course stand out',
        }}
        render={({ field, fieldState }) => (
          <UploadImage
            onChange={field.onChange}
            value={field.value}
            error={fieldState?.error?.message}
          />
        )}
      />
      <Controller
        name="certificationLogo"
        control={control}
        rules={{
          required:
            'Please upload an certification image, this helps your course stand out',
        }}
        render={({ field, fieldState }) => (
          <UploadImage
            onChange={field.onChange}
            value={field.value}
            error={fieldState?.error?.message}
            defaultSize={{
              width: 150,
              height: 150,
            }}
            label={t('createCourse.curriculum.landingPage.certificationLogo')}
          />
        )}
      />
      <Controller
        name="video"
        control={control}
        rules={{
          required: 'Please upload a video, this helps your course stand out',
        }}
        render={({ field, fieldState }) => (
          <PromotionalVideo
            onChange={field.onChange}
            value={field.value}
            error={fieldState?.error?.message}
          />
        )}
      />
    </div>
  );
};
export default CourseLandingPage;

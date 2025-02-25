import { Button } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { userRequest, TUser } from './service';
import { useEffect, useState } from 'react';
import InputText from '../UI/InputText';
import InputTextArena from '../UI/InputTextArena';
import { toast } from '../UI/Toast/toast';
import { useTranslation } from 'next-i18next';

const inputFields = [
  {
    name: 'fullName',
    label: 'Full Name',
    placeholder: 'Full Name',
    type: 'text',
    atRow: 1,
  },
  // {
  //   name: 'lastName',
  //   label: 'Last Name',
  //   placeholder: 'Type',
  //   type: 'text',
  //   atRow: 1,
  // },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'example@gmail.com',
    type: 'text',
    atRow: 1,
    rules: {
      validate: (value: string) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ||
        'Invalid email format',
    },
  },
  {
    name: 'headline',
    label: 'Headline',
    placeholder: 'Type',
    type: 'textarea',
    atRow: 1,
  },
  {
    name: 'biography',
    label: 'Biography',
    placeholder: 'Type',
    type: 'text',
    atRow: 1,
  },
  {
    name: 'websiteUrl',
    label: 'Website',
    placeholder: 'URL',
    type: 'url',
    atRow: 2,
  },
  {
    name: 'x',
    label: 'X',
    placeholder: 'Username',
    type: 'text',
    atRow: 2,
  },
  {
    name: 'facebook',
    label: 'Facebook',
    placeholder: 'Username',
    type: 'text',
    atRow: 2,
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'Username',
    type: 'text',
    atRow: 2,
  },
  {
    name: 'youtube',
    label: 'YouTube',
    placeholder: 'Username',
    type: 'text',
    atRow: 2,
  },
];

export default function Information({
  reload,
  user,
}: {
  reload: VoidFunction;
  user?: TUser;
}) {
  const { t } = useTranslation('common');
  const { handleSubmit, setValue, control, getValues } = useForm({
    mode: 'onChange', // Triggers validation on each change
  });
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>({});

  useEffect(() => {
    if (!user) return;
    const userData: any = {};
    Object.entries(user).forEach(([key, value]) => {
      if (inputFields.find((field) => field.name === key)) {
        setValue(key as keyof typeof user, value);
        userData[key] = value;
      }
    });
    setValue('fullName', user?.fullName);
    setInitialData(userData);
  }, [user]);

  const onSubmit = async (data: any) => {
    if (JSON.stringify(data) === JSON.stringify(initialData)) {
      toast.error(t('No changes detected!'));
      return;
    }

    try {
      setLoading(true);
      await userRequest.update({
        ...data,
      });
      reload();
      toast.success(t('Update Successful!'));
    } catch (error) {
      console.log(error);
      toast.error(t('Update failed!'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-900 text-white rounded-lg w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="box-border">
        <div className="flex md:flex-row flex-col gap-6">
          <div className="flex flex-col gap-6 w-full">
            {inputFields
              .filter((field) => field.atRow === 1)
              .map((field, index) => (
                <Field
                  fieldItem={field}
                  key={index}
                  control={control}
                  rules={field.rules}
                />
              ))}
          </div>
          <div className="flex flex-col gap-6 w-full">
            {inputFields
              .filter((field) => field.atRow === 2)
              .map((field, index) => (
                <Field
                  fieldItem={field}
                  key={index}
                  control={control}
                  rules={field.rules}
                />
              ))}
          </div>
        </div>

        <div className="mt-[32px]">
          <Button
            isLoading={loading}
            type="submit"
            className="w-fit px-[24px] bg-main text-white font-semibold py-[10px] rounded-[4px] hover:bg-cyan-400 transition"
          >
            {t('Save Profile')}
          </Button>
        </div>
      </form>
    </div>
  );
}

const Field = ({
  fieldItem,
  control,
  rules,
}: {
  fieldItem: {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    atRow: number;
  };
  control: any;
  rules: any;
}) => {
  const { t } = useTranslation('common');
  console.log(fieldItem, 'fieldItem');

  return (
    <div className="w-full">
      <label className="block text-base font-semibold mb-1">
        {t(fieldItem.label)}
      </label>

      {fieldItem?.name === 'email' ? (
        <Controller
          name={'email'}
          control={control}
          rules={{
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: t('message_email'),
            },
          }}
          render={({ field, fieldState }) => {
            return (
              <InputText
                error={fieldState?.error?.message}
                className="bg-[#242A30] w-full rounded-[4px] active:outline-hidden"
                placeholder={t(fieldItem.placeholder)}
                value={field.value || ''}
                onChange={field.onChange}
              />
            );
          }}
        />
      ) : (
        <Controller
          name={fieldItem.name}
          control={control}
          render={({ field }) => {
            if (fieldItem.type === 'textarea') {
              return (
                <InputTextArena
                  placeholder={t(fieldItem.placeholder)}
                  value={field.value}
                  minRows={5}
                  inputDefault
                  onChange={field.onChange}
                />
              );
            }

            return (
              <InputText
                className="bg-[#242A30] w-full rounded-[4px] active:outline-hidden"
                placeholder={t(fieldItem.placeholder)}
                value={field.value || ''}
                onChange={field.onChange}
              />
            );
          }}
        />
      )}
    </div>
  );
};

import { Button } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { userRequest, TUser } from './service';
import { useEffect, useState } from 'react';
import InputText from '../UI/InputText';
import InputTextArena from '../UI/InputTextArena';
import { toast } from '../UI/Toast/toast';
import { useProfile } from '@/store/profile/useProfile';

const inputFields = [
  {
    name: 'fullName',
    label: 'Full Name',
    placeholder: 'Full Name',
    type: 'text',
    atRow: 1,
  },

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
    name: 'biography',
    label: 'Biography',
    placeholder: 'Type',
    type: 'textarea',
    atRow: 1,
    max: 1500,
  },
  {
    name: 'headline',
    label: 'Headline',
    placeholder: 'Type',
    type: 'text',
    atRow: 1,
    max: 250,
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

export default function Information({ reload }: { reload: VoidFunction }) {
  const { handleSubmit, setValue, control, getValues, reset } = useForm({
    mode: 'onChange', // Triggers validation on each change
  });
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>({});
  const { profile } = useProfile();

  useEffect(() => {
    if (!profile?.id) return;
    const userData: any = {};
    Object.entries(profile).forEach(([key, value]) => {
      if (inputFields.find((field) => field.name === key)) {
        setValue(key as keyof typeof profile, value);
        userData[key] = value;
      }
    });

    reset(userData);
    setInitialData(userData);
  }, [profile?.id]);

  const onSubmit = async (data: any) => {
    if (JSON.stringify(data) === JSON.stringify(initialData)) {
      toast.error('No changes detected!');
      return;
    }

    try {
      setLoading(true);
      await userRequest.update({
        ...data,
      });
      reload();
      toast.success('Update Successful!');
    } catch (error) {
      console.log(error);
      toast.error('Update failed!');
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
            className="w-fit px-[24px] bg-main text-text-white font-semibold py-[10px] rounded-[4px] hover:bg-cyan-400 transition"
          >
            {'Save Profile'}
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
    max?: number;
  };
  control: any;
  rules: any;
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-base font-semibold">
          {fieldItem.label}
        </label>
        {fieldItem.max && (
          <Controller
            name={fieldItem.name}
            control={control}
            render={({ field }) => {
              const currentLength = field.value?.length || 0;
              const remaining = fieldItem.max! - currentLength;
              return (
                <div className="text-sm text-[#cccccc96]">{remaining}</div>
              );
            }}
          />
        )}
      </div>

      {fieldItem?.name === 'email' ? (
        <Controller
          name={'email'}
          control={control}
          rules={{
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: 'message_email',
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
          rules={{
            ...(fieldItem.max && {
              maxLength: {
                value: fieldItem.max,
                message: `Max ${fieldItem.max} character`,
              },
            }),
          }}
          render={({ field, fieldState }) => {
            if (fieldItem.type === 'textarea') {
              return (
                <>
                  <InputTextArena
                    placeholder={t(fieldItem.placeholder)}
                    value={field.value}
                    minRows={5}
                    inputDefault
                    onChange={field.onChange}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              );
            }

            return (
              <>
                <InputText
                  className="bg-gray-50 w-full rounded-[4px] active:outline-hidden"
                  placeholder={t(fieldItem.placeholder)}
                  value={field.value || ''}
                  onChange={field.onChange}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            );
          }}
        />
      )}
    </div>
  );
};

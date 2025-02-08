import { Button } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { userRequest, TUser } from './service';
import { useEffect, useState } from 'react';
import InputText from '../UI/InputText';
import InputTextArena from '../UI/InputTextArena';
import { toast } from '../UI/Toast/toast';

export default function Information({
  reload,
  user,
}: {
  reload: VoidFunction;
  user?: TUser;
}) {
  const { handleSubmit, setValue, control } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
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
  const inputFields = [
    {
      name: 'firstName',
      label: 'First Name',
      placeholder: 'First Name',
      type: 'text',
      atRow: 1,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Type',
      type: 'text',
      atRow: 1,
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

  useEffect(() => {
    if (!user) return;
    Object.entries(user).forEach(([key, value]) => {
      setValue(key as keyof typeof user, value);
    });
  }, [user]);

  return (
    <div className="bg-gray-900 text-white rounded-lg w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="box-border">
        <div className="flex md:flex-row flex-col gap-6">
          <div className="flex flex-col gap-6 w-full">
            {inputFields
              .filter((field) => field.atRow === 1)
              .map((field, index) => (
                <Field fieldItem={field} key={index} control={control} />
              ))}
          </div>
          <div className="flex flex-col gap-6 w-full">
            {inputFields
              .filter((field) => field.atRow === 2)
              .map((field, index) => (
                <Field fieldItem={field} key={index} control={control} />
              ))}
          </div>
        </div>

        <div className="mt-[12px]">
          <Button
            isLoading={loading}
            type="submit"
            className="w-fit px-[24px] bg-[#02A6C2] text-white font-semibold py-[10px] rounded-[4px] hover:bg-cyan-400 transition"
          >
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}

const Field = ({
  fieldItem,
  control,
}: {
  fieldItem: {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    atRow: number;
  };
  control: any;
}) => {
  return (
    <div className="w-full">
      <label className="block text-base font-semibold mb-1">
        {fieldItem.label}
      </label>

      <Controller
        name={fieldItem.name}
        control={control}
        render={({ field }) => {
          if (fieldItem.type === 'textarea') {
            return (
              <InputTextArena
                placeholder={fieldItem.placeholder}
                className={`bg-[#242A30] w-full h-full`}
              />
            );
          }
          return (
            <InputText
              name={field.name}
              className="bg-[#242A30] w-full rounded-[4px] active:outline-hidden"
              placeholder="Type"
              value={field.value}
              onChange={field.onChange}
            />
          );
        }}
      />
    </div>
  );
};

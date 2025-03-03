import InputText from '@/components/UI/InputText';
import Text from '@/components/UI/Text';
import { Button } from '@nextui-org/react';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import Image from 'next/image';
import { useState } from 'react';
import { useLoginUserName } from './service';
import { setAuthCookies } from '@/store/auth';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/utils/const';

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [valueUserName, setValueUserName] = useState('');
  const [valuePassword, setValuePassword] = useState('');
  const router = useRouter();

  const requestLogin = useLoginUserName({
    onSuccess: (res: any) => {
      setAuthCookies({
        token: `${res?.data.accessToken}`,
      });
      router.push(`/platform/${ROUTE_PATH.CREATE_COURSE}`);
    },
  });

  const handleLogin = () => {
    const body = {
      email: valueUserName,
      password: valuePassword,
    };
    requestLogin.run(body);
  };
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="mb-8 flex flex-col gap-8 items-center">
        <Image
          alt="logo"
          width={125}
          height={46}
          className="cursor-pointer"
          src={'/logo.png'}
        />
        <Text type="font-28-700" className="text-white">
          Sign in to LMS Study
        </Text>
      </div>

      <InputText
        classInputWrapper="min-w-[400px]"
        placeholder="Username"
        isInputSubmit
        onChange={(e: any) => setValueUserName(e.target.value)}
      />
      <InputText
        classInputWrapper="min-w-[400px]"
        placeholder="Password"
        isInputSubmit
        onChange={(e: any) => setValuePassword(e.target.value)}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Eye size={20} color="#FFFFFF99" />
            ) : (
              <EyeSlash size={20} color="#FFFFFF99" />
            )}
          </button>
        }
        type={showPassword ? 'text' : 'password'}
      />

      <Button
        isLoading={requestLogin?.loading}
        onPress={handleLogin}
        className="bg-main min-w-[400px] min-h-[40px] rounded mt-2"
      >
        Login
      </Button>
    </div>
  );
};
export default Login;

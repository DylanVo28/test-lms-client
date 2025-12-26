import { Button } from '@nextui-org/react';
import Text from '../Text';
import { usePrivy } from '@privy-io/react-auth';
import useAccessToken from '@/store/auth/hook/useAccessToken';

const CustomButtonComment = ({}: {}) => {
  const { login } = usePrivy();
  const accessToken = useAccessToken();
  // If user is already logged in, don't show login button
  const isLoggedIn = !!accessToken;

  if (isLoggedIn) {
    return null;
  }

  return (
    <div
      className="w-full"
      style={{
        display: 'flex',
        gap: 12,
      }}
    >
      <Button
        onPress={()=>login()}
        className="border-1 min-h-10 max-w-[185px] border-black-9 py-2 px-4 rounded bg-black-10"
      >
        <Text className="capitalize text-letter" type="font-16-500">
          Login to comment
        </Text>
      </Button>
    </div>
  );
};

export default CustomButtonComment;

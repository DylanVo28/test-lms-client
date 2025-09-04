import { getAccessToken } from '.';

export const useAuth = () => {
  const accessToken = getAccessToken();

  return {
    isLogin: !!accessToken,
  };
};

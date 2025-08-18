/* eslint-disable require-await */
import { API_PATH } from '@/api/constant';
import { request } from '@/api/request';
import { useRequest } from 'ahooks';

interface IOptionsRequest {
  onSuccess?: (r: any) => void;
  onError?: (e: any) => void;
}

export const useLoginUserName = (options?: IOptionsRequest) => {
  return useRequest(
    async ({ email, password }: { email: string; password: string }) => {
      return request.post(API_PATH.AUTH_LOGIN, {
        data: {
          email,
          password,
        },
      });
    },
    {
      manual: true,
      ...options,
    }
  );
};

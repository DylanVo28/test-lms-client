/* eslint-disable require-await */
import { API_PATH } from '@/api/constant';
import { IOptions } from '@/api/interface';
import { privateRequest, request } from '@/api/request';
import { useRequest } from 'ahooks';

const serviceGetUserNonce = async (address: string) => {
  const params = {
    address,
  };
  return privateRequest(request.get, API_PATH.GET_NONCE, { params });
};

export const useGetUserNonce = (options?: IOptions) => {
  return useRequest(serviceGetUserNonce, { manual: true, ...options });
};

const serviceLoginWeb3 = async (data: {
  address: string;
  signature: string;
  refCode: string;
}) => {
  return privateRequest(request.post, API_PATH.LOGIN_WEB3, { data });
};

export const useLoginWeb3 = (options?: IOptions) => {
  return useRequest(serviceLoginWeb3, { manual: true, ...options });
};

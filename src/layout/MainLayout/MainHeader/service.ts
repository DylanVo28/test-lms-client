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

const serviceLoginWeb3 = async (body: any) => {
  return privateRequest(request.post, API_PATH.LOGIN_WEB3, { data: body });
};

export const useLoginWeb3 = (options?: IOptions) => {
  return useRequest(serviceLoginWeb3, { manual: true, ...options });
};

export const registerUser = async (body: any) => {
  return privateRequest(request.post, API_PATH.REGISTER_USER, { data: body });
};

// check if address is already in the database
export const serviceCheckAddress = async (address: string) => {
  return privateRequest(request.get, API_PATH.CHECK_ADDRESS, {
    params: { address },
  });
};

const serviceLogout = async () => {
  return privateRequest(request.post, API_PATH.LOGOUT);
};

export const useLogout = (options?: IOptions) => {
  return useRequest(serviceLogout, { manual: true, ...options });
};

import { API_PATH } from '@/api/constant';
import { IOptions } from '@/api/interface';
import { privateRequest, request } from '@/api/request';
import { useRequest } from 'ahooks';

const serviceFollowMentor = async (id: string) => {
  return privateRequest(request.post, API_PATH.FOLLOW_MENTOR(id));
};

export const useFollowMentor = (options?: IOptions) => {
  return useRequest(serviceFollowMentor, { manual: true, ...options });
};

const serviceUnFollowMentor = async (id: string) => {
  return privateRequest(request.post, API_PATH.UN_FOLLOW_MENTOR(id));
};

export const useUnFollowMentor = (options?: IOptions) => {
  return useRequest(serviceUnFollowMentor, { manual: true, ...options });
};

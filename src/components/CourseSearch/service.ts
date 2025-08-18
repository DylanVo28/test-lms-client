import { API_PATH } from '@/api/constant';
import { IOptions } from '@/api/interface';
import { privateRequest, request } from '@/api/request';
import { useProfile } from '@/store/profile/useProfile';
import { useRequest } from 'ahooks';

const serviceLikeCourse = async (id: string) => {
  return privateRequest(request.post, API_PATH.LIKE_COURSE(id));
};

export const useLikeCourse = (options?: IOptions) => {
  return useRequest(serviceLikeCourse, { manual: true, ...options });
};

const serviceUnLikeCourse = async (id: string) => {
  return privateRequest(request.delete, API_PATH.LIKE_COURSE(id));
};

export const useUnLikeCourse = (options?: IOptions) => {
  return useRequest(serviceUnLikeCourse, { manual: true, ...options });
};

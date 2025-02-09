/* eslint-disable require-await */
import { API_PATH } from '@/api/constant';
import { IOptions } from '@/api/interface';
import { privateRequest, request } from '@/api/request';
import { useRequest } from 'ahooks';

const serviceClaimCertificates = async (data: { courseId: string }) => {
  return privateRequest(request.post, API_PATH.CLAIM_CERTIFICATES, { data });
};

export const useClaimCertificates = (options?: IOptions) => {
  return useRequest(serviceClaimCertificates, { manual: true, ...options });
};

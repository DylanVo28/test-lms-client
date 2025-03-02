import { injectBearer } from 'brainless-token-manager';
import { extend } from 'umi-request';

import { ENV } from '@/utils/env';
import { deleteAuthCookies, getAccessToken } from '@/store/auth';

const REQ_TIMEOUT = 25 * 1000;
export const isDev = ENV.NODE_ENV === 'development';

export const PREFIX_API = ENV.APP_API_URL;

console.log(PREFIX_API, 'PREFIX_API');

const request = extend({
  prefix: PREFIX_API,
  timeout: REQ_TIMEOUT,
  errorHandler: (error) => {
    // if (getAccessToken() && error?.data?.status_code === 401) {
    //   deleteAuthCookies();
    //   window.location.href = '/';
    //   return;
    // }

    throw error?.data || error?.response;
  },
});

const privateRequest = async (
  request: any,
  suffixUrl: string,
  configs?: any
) => {
  const accessToken = getAccessToken();
  const token: string = configs?.token ?? (accessToken as string);

  return request(suffixUrl, injectBearer(token, configs));
};

export { privateRequest, request };

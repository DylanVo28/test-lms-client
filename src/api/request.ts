import { toast } from '@/components/UI/Toast/toast';
import { deleteAuthCookies, getAccessToken } from '@/store/auth';
import { ENV } from '@/utils/env';
import { translate } from '@/utils/i18n-utils';
import { injectBearer } from 'brainless-token-manager';
import { extend } from 'umi-request';
import { API_PATH } from './constant';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useAccount } from 'wagmi';

const REQ_TIMEOUT = 25 * 1000;
export const isDev = ENV.NODE_ENV === 'development';

export const PREFIX_API = ENV.APP_API_URL;

const handleLogout = async () => {
  try {
    await privateRequest(request.post, `${API_PATH.LOGOUT}`, {});
  } catch (error) {
    console.error(translate('Logout API failed'), error);
  }
  toast.error(translate('Expire Token'));
};

const request = extend({
  prefix: PREFIX_API,
  timeout: REQ_TIMEOUT,
  errorHandler: (error) => {
    if (error?.data?.statusCode === 403 || error?.data?.statusCode === 401) {
      if (getAccessToken()) {
        handleLogout();
      }
      deleteAuthCookies();
      window.location.href = '/';

      return;
    }

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

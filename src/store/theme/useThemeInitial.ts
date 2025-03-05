/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { themeAtom } from './theme';
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { useRouter } from 'next/router';
import { useProfile } from '../profile/useProfile';
import { getAccessToken } from '../auth';

export const useThemeInitial = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const router = useRouter();
  const { profile } = useProfile();
  const token = getAccessToken();

  const run = () => {
    const init = async () => {
      let res;
      if (router.query?.code && router.query?.code !== 'platform') {
        res = await privateRequest(
          request.get,
          API_PATH.THEMES + `/${router.query?.code}`
        );
        setTheme({
          ...res?.data,
          kolId: res?.data?.userId,
        });
        document.body.setAttribute('data-theme', res?.data?.color);
        return;
      }

      if (profile?.role === 'KOL' && token) {
        res = await privateRequest(request.get, API_PATH.THEME_DETAIL);
        setTheme({
          ...res?.data,
        });
        document.body.setAttribute('data-theme', res?.data?.color);
        return;
      }
    };
    init();
  };

  return {
    theme,
    setTheme,
    requestGetTheme: run,
  };
};

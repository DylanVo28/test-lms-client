/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { themeAtom } from './theme';
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { useRouter } from 'next/router';
import { useProfile } from '../profile/useProfile';

export const useThemeInitial = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const router = useRouter();
  console.log('router', router);
  const { profile } = useProfile();
  const run = () => {
    const init = async () => {
      let res;
      if (router.query?.code) {
        if (profile?.role === 'KOL') {
          res = await privateRequest(request.get, API_PATH.THEME_DETAIL);
          setTheme({
            ...res?.data,
          });
        } else {
          res = await privateRequest(
            request.get,
            API_PATH.THEMES + `/${router.query?.code}`
          );
          setTheme({
            ...res?.data,
            kolId: res?.data?.userId,
          });
        }
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

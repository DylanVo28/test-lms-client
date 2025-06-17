/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { themeAtom } from './theme';
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { useRouter } from 'next/router';
import { useProfile } from '../profile/useProfile';
import useAccessToken from '../auth/hook/useAccessToken';
import { useAccount } from 'wagmi';

export const useThemeInitial = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const router = useRouter();
  const { profile } = useProfile();
  const { address } = useAccount();
  const token = useAccessToken();

  const run = () => {
    const init = async () => {
      let res;

      if (profile?.role === 'KOL' && token) {
        res = await privateRequest(request.get, API_PATH.THEME_DETAIL);
        setTheme({
          ...res?.data,
        });
        document.body.setAttribute('data-theme', res?.data?.color);
        return;
      } else {
        if (router.query?.code) {
          res = await privateRequest(
            request.get,
            API_PATH.THEMES + `/${router.query?.code}`
          );

          const adminRes = await privateRequest(
            request.get,
            API_PATH.THEMES + `/platform`
          );

          setTheme({
            ...res?.data,
            kolId: res?.data?.userId,
            adminId: adminRes?.data?.userId,
          });
          document.body.setAttribute('data-theme', res?.data?.color);
          return;
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

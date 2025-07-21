/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { DefaultThemeColor, themeAtom } from './theme';
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { useRouter } from 'next/router';
import { useProfile } from '../profile/useProfile';
import useAccessToken from '../auth/hook/useAccessToken';
import { useAccount } from 'wagmi';
import { myThemeAtom } from './my-theme';

export const useThemeInitial = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const [myTheme, setMyTheme] = useAtom(myThemeAtom);
  const router = useRouter();
  const { profile } = useProfile();
  const { address } = useAccount();
  const token = useAccessToken();

  console.log(theme, 'theme');

  const run = () => {
    const init = async () => {
      let res;

      const adminRes = await privateRequest(
        request.get,
        API_PATH.THEMES + `/platform`
      );
      if (profile?.role === 'KOL' && token) {
        res = await privateRequest(
          request.get,
          API_PATH.THEMES + `/${router.query?.code}`
        );

        setTheme({
          ...res?.data,
          kolId: res?.data?.userId ?? adminRes?.data?.userId,
          adminId: adminRes?.data?.userId,
          color: JSON.parse(
            res?.data?.color || JSON.stringify(DefaultThemeColor)
          ),
        });

        const myThemeRes = await privateRequest(
          request.get,
          API_PATH.THEME_DETAIL
        );

        setMyTheme({
          ...myThemeRes?.data,
          color: JSON.parse(
            myThemeRes?.data?.color || JSON.stringify(DefaultThemeColor)
          ),
        });

        document.body.setAttribute('data-theme', res?.data?.color);
        return;
      } else {
        if (router.query?.code) {
          res = await privateRequest(
            request.get,
            API_PATH.THEMES + `/${router.query?.code}`
          );

          setTheme({
            ...res?.data,
            kolId: res?.data?.userId ?? adminRes?.data?.userId,
            adminId: adminRes?.data?.userId,
            color: JSON.parse(
              res?.data?.color || JSON.stringify(DefaultThemeColor)
            ),
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
    myTheme,
    setMyTheme,
  };
};

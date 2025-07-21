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
import {
  applyCustomColors,
  getCustomColorsFromTheme,
} from '@/utils/themeColors';

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

        const themeColors = JSON.parse(
          res?.data?.color || JSON.stringify(DefaultThemeColor)
        );

        setTheme({
          ...res?.data,
          kolId: res?.data?.userId ?? adminRes?.data?.userId,
          adminId: adminRes?.data?.userId,
          color: themeColors,
        });

        const myThemeRes = await privateRequest(
          request.get,
          API_PATH.THEME_DETAIL
        );

        const myThemeColors = JSON.parse(
          myThemeRes?.data?.color || JSON.stringify(DefaultThemeColor)
        );

        setMyTheme({
          ...myThemeRes?.data,
          color: myThemeColors,
        });

        // Apply custom colors to CSS variables
        applyCustomColors(getCustomColorsFromTheme(themeColors));

        document.body.setAttribute('data-theme', res?.data?.color);
        return;
      } else {
        if (router.query?.code) {
          res = await privateRequest(
            request.get,
            API_PATH.THEMES + `/${router.query?.code}`
          );

          const themeColors = JSON.parse(
            res?.data?.color || JSON.stringify(DefaultThemeColor)
          );

          setTheme({
            ...res?.data,
            kolId: res?.data?.userId ?? adminRes?.data?.userId,
            adminId: adminRes?.data?.userId,
            color: themeColors,
          });

          // Apply custom colors to CSS variables
          applyCustomColors(getCustomColorsFromTheme(themeColors));

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

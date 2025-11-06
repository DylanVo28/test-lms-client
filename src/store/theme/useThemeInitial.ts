/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';
import { useRef } from 'react';

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
import {
  THEME_PREVIEW_KEY,
  THEME_PREVIEW_MODE_KEY,
} from '@/utils/theme-preview';

export const useThemeInitial = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const [myTheme, setMyTheme] = useAtom(myThemeAtom);
  const router = useRouter();
  const { profile } = useProfile();
  const { address } = useAccount();
  const token = useAccessToken();
  const fetchingRef = useRef(false);
  const lastFetchParamsRef = useRef<string>('');

  console.log(theme, 'theme');

  const run = () => {
    const init = async () => {
      // Create unique key for current fetch params to prevent duplicate calls
      const fetchKey = `${router.query?.code || ''}-${profile?.id || ''}-${token || ''}`;
      
      // Prevent duplicate calls with same params
      if (fetchingRef.current && lastFetchParamsRef.current === fetchKey) {
        return;
      }

      fetchingRef.current = true;
      lastFetchParamsRef.current = fetchKey;

      try {
        // Check preview mode first
        const isPreview = localStorage.getItem(THEME_PREVIEW_MODE_KEY) === 'true';
        // If in preview mode and has preview data, use that instead\

        if (isPreview) {
          const previewData = localStorage.getItem(THEME_PREVIEW_KEY);
          if (previewData) {
            const parsedData = JSON.parse(previewData);
            setTheme({
              ...theme,
              title: parsedData.title,
              description: parsedData.description,
              topics: parsedData.topics,
              banner: parsedData.banner,
              logo: parsedData.logo,
              color: parsedData.color,
            });
            applyCustomColors(parsedData.color);
            return;
          }
        }

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
      } catch (error) {
        console.error('Error fetching theme:', error);
      } finally {
        fetchingRef.current = false;
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

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
  consumeForcePlatformThemeFlag,
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
  const fetchingThemeDetailRef = useRef(false);
  const cachedThemeDetailRef = useRef<any>(null);
  const lastThemeDetailFetchRef = useRef<string | null>(null);

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

        const shouldForcePlatformTheme = consumeForcePlatformThemeFlag();

        const adminRes = await privateRequest(
          request.get,
          API_PATH.THEMES + `/platform`
        );
        const shouldUsePlatformTheme =
          shouldForcePlatformTheme || !token || !profile?.id;

        const currentCode = router.query?.code?.toString().toLowerCase();
        const isPlatformPage = !currentCode || currentCode === 'platform';

        // Check if user has their own refCode (not platform/admin's refCode)
        const hasOwnRefCode = profile?.refererCode && 
                              profile.refererCode.toLowerCase() !== 'platform';

        // Helper function to fetch theme detail with caching
        const fetchThemeDetailWithCache = async () => {
          const cacheKey = `${profile?.id}-${token}`;
          
          // Return cached result if available and same user/token
          if (cachedThemeDetailRef.current && lastThemeDetailFetchRef.current === cacheKey) {
            return cachedThemeDetailRef.current;
          }
          
          // Prevent duplicate calls
          if (fetchingThemeDetailRef.current) {
            // Wait a bit and return cached if available
            await new Promise(resolve => setTimeout(resolve, 100));
            if (cachedThemeDetailRef.current && lastThemeDetailFetchRef.current === cacheKey) {
              return cachedThemeDetailRef.current;
            }
            return null;
          }
          
          try {
            fetchingThemeDetailRef.current = true;
            const myThemeRes = await privateRequest(
              request.get,
              API_PATH.THEME_DETAIL
            );
            cachedThemeDetailRef.current = myThemeRes;
            lastThemeDetailFetchRef.current = cacheKey;
            return myThemeRes;
          } catch (error) {
            console.error('Error fetching theme detail:', error);
            return null;
          } finally {
            fetchingThemeDetailRef.current = false;
          }
        };

        // Case 1: ADMIN → use platform theme (default)
        // BUT: If ADMIN also has their own refCode (is also KOL), use their own theme
        if (profile?.role === 'ADMIN' && token && !shouldUsePlatformTheme) {
          if (hasOwnRefCode) {
            // User is both ADMIN and KOL - use their own custom theme
            const myThemeRes = await fetchThemeDetailWithCache();
            
            if (!myThemeRes) {
              // Fallback to platform theme if fetch fails
              const platformColors = JSON.parse(
                adminRes?.data?.color || JSON.stringify(DefaultThemeColor)
              );
              setTheme({
                ...adminRes?.data,
                kolId: adminRes?.data?.userId,
                adminId: adminRes?.data?.userId,
                color: platformColors,
              });
              applyCustomColors(getCustomColorsFromTheme(platformColors));
              document.body.setAttribute('data-theme', adminRes?.data?.color || '');
              return;
            }

            const myThemeColors = JSON.parse(
              myThemeRes?.data?.color || JSON.stringify(DefaultThemeColor)
            );

            setTheme({
              ...myThemeRes?.data,
              kolId: myThemeRes?.data?.userId ?? adminRes?.data?.userId,
              adminId: adminRes?.data?.userId,
              color: myThemeColors,
            });

            setMyTheme({
              ...myThemeRes?.data,
              color: myThemeColors,
            });

            applyCustomColors(getCustomColorsFromTheme(myThemeColors));
            document.body.setAttribute('data-theme', myThemeRes?.data?.color || '');
            return;
          } else {
            // Pure ADMIN → use platform theme
            const platformColors = JSON.parse(
              adminRes?.data?.color || JSON.stringify(DefaultThemeColor)
            );

            setTheme({
              ...adminRes?.data,
              kolId: adminRes?.data?.userId,
              adminId: adminRes?.data?.userId,
              color: platformColors,
            });

            applyCustomColors(getCustomColorsFromTheme(platformColors));
            document.body.setAttribute('data-theme', adminRes?.data?.color || '');
            return;
          }
        }

        // Case 2: KOL → always use their own custom theme (from THEME_DETAIL)
        if (profile?.role === 'KOL' && token && !shouldUsePlatformTheme) {
          // For KOL, always fetch their own theme from THEME_DETAIL API
          // This ensures they get their custom theme, not admin's theme
          const myThemeRes = await fetchThemeDetailWithCache();
          
          if (!myThemeRes) {
            // Fallback to platform theme if fetch fails
            const platformColors = JSON.parse(
              adminRes?.data?.color || JSON.stringify(DefaultThemeColor)
            );
            setTheme({
              ...adminRes?.data,
              kolId: adminRes?.data?.userId,
              adminId: adminRes?.data?.userId,
              color: platformColors,
            });
            applyCustomColors(getCustomColorsFromTheme(platformColors));
            document.body.setAttribute('data-theme', adminRes?.data?.color || '');
            return;
          }

          const myThemeColors = JSON.parse(
            myThemeRes?.data?.color || JSON.stringify(DefaultThemeColor)
          );

          // Use KOL's own theme
          setTheme({
            ...myThemeRes?.data,
            kolId: myThemeRes?.data?.userId ?? adminRes?.data?.userId,
            adminId: adminRes?.data?.userId,
            color: myThemeColors,
          });

          setMyTheme({
            ...myThemeRes?.data,
            color: myThemeColors,
          });

          // Apply custom colors to CSS variables
          applyCustomColors(getCustomColorsFromTheme(myThemeColors));

          document.body.setAttribute('data-theme', myThemeRes?.data?.color || '');
          return;
        }

        // Case 3 & 4: USER or other cases
        if (!shouldUsePlatformTheme && router.query?.code && !isPlatformPage) {
          // Case 3: USER có refCode của KOL → use KOL theme
          // This handles when USER is on a KOL's refCode page
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

        // Case 4: USER không có refCode KOL (dùng refCode ADMIN) → /platform with default theme
        // Or fallback: platform theme when no token/profile (e.g., after logout)
        const platformColors = JSON.parse(
          adminRes?.data?.color || JSON.stringify(DefaultThemeColor)
        );

        setTheme({
          ...adminRes?.data,
          kolId: adminRes?.data?.userId,
          adminId: adminRes?.data?.userId,
          color: platformColors,
        });

        applyCustomColors(getCustomColorsFromTheme(platformColors));
        document.body.setAttribute('data-theme', adminRes?.data?.color || '');
        return;
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

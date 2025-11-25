/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { initialProfile, profileAtom } from './profile';
import { API_PATH } from '@/api/constant';
import { PREFIX_API, privateRequest, request } from '@/api/request';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { deleteAuthCookies, getAccessToken } from '../auth';
import { useAccount, useDisconnect } from 'wagmi';
import { notificationAtom } from '../notification/notification';
import { useLogout } from '@/layout/MainLayout/MainHeader/service';
import { initialTheme, themeAtom } from '../theme/theme';

export const useProfileInitial = () => {
  const { address } = useAccount();
  const [profile, setProfile] = useAtom(profileAtom);
  const [loading, setLoading] = useState(false);
  const { disconnect } = useDisconnect();

  const [, setNotifications] = useAtom(notificationAtom);
  const [_, setTheme] = useAtom(themeAtom);

  const router = useRouter();

  const { run: runLogout } = useLogout({
    onSuccess(res) {},
  });

  const getMe = async () => {
    try {
      setLoading(true);
      const res = await privateRequest(
        fetch,
        `${PREFIX_API}${API_PATH.GET_USER}`
      ).then((res) => res.json());
      setProfile({
        ...res?.data,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken && router.pathname !== '/') {
      // router.replace('/');
    }

    if (!profile?.id) return;

    // Only run this logic on landing/dynamic theme routes
    const isThemeRoute = router.pathname === '/' || router.pathname === '/[code]';
    if (!isThemeRoute) {
      return;
    }

    const rawRouteCode = router.query.code;
    const currentRouteCode = Array.isArray(rawRouteCode)
      ? rawRouteCode[0]
      : rawRouteCode;

    const normalizedRouteCode = currentRouteCode?.toLowerCase();
    
    // Determine preferred slug based on user role and referral codes
    const determinePreferredSlug = async () => {
      let preferredSlug: string;
      
      // Priority: KOL role takes precedence over ADMIN
      // For KOL, fetch their theme to get their actual refCode (slug) from theme data
      if (profile?.role === 'KOL' && accessToken) {
        try {
          // Fetch KOL's theme to get their actual refCode (code field in theme)
          const myThemeRes = await privateRequest(
            request.get,
            API_PATH.THEME_DETAIL
          );
          
          const kolRefCode = myThemeRes?.data?.code;
          
          if (kolRefCode && kolRefCode.toLowerCase() !== 'platform') {
            // KOL has their own refCode from theme → use it
            preferredSlug = kolRefCode;
          } else {
            // KOL without valid refCode → /platform (fallback)
            preferredSlug = 'platform';
          }
        } catch (error) {
          console.error('Error fetching KOL theme for refCode:', error);
          // Fallback to profile.refererCode if theme fetch fails
          const hasOwnRefCode = profile?.refererCode && 
                                profile.refererCode.toLowerCase() !== 'platform';
          preferredSlug = hasOwnRefCode ? profile.refererCode : 'platform';
        }
      } else if (profile?.role === 'ADMIN') {
        // Case 1: ADMIN → /platform
        // BUT: If ADMIN also has their own refCode (is also KOL), fetch theme to get it
        if (accessToken) {
          try {
            const myThemeRes = await privateRequest(
              request.get,
              API_PATH.THEME_DETAIL
            );
            
            const adminRefCode = myThemeRes?.data?.code;
            
            if (adminRefCode && adminRefCode.toLowerCase() !== 'platform') {
              // User is both ADMIN and KOL - use their own refCode from theme
              preferredSlug = adminRefCode;
            } else {
              // Pure ADMIN → /platform
              preferredSlug = 'platform';
            }
          } catch (error) {
            console.error('Error fetching ADMIN theme for refCode:', error);
            // Fallback to platform
            preferredSlug = 'platform';
          }
        } else {
          preferredSlug = 'platform';
        }
      } else if (profile?.role === 'USER') {
        // Case 3 & 4: USER
        if (profile?.refererThemeCode && profile.refererThemeCode.toLowerCase() !== 'platform') {
          // Case 3: USER có refCode của KOL → /{refCodeKOL}
          preferredSlug = profile.refererThemeCode;
        } else {
          // Case 4: USER không có refCode KOL (dùng refCode ADMIN) → /platform
          preferredSlug = 'platform';
        }
      } else {
        // Fallback: default to platform
        preferredSlug = 'platform';
      }

      const normalizedPreferredSlug = preferredSlug?.toLowerCase();

      // If already on the correct route, no need to redirect
      if (normalizedRouteCode === normalizedPreferredSlug) {
        return;
      }

      // Redirect to preferred slug
      router.replace(`/${preferredSlug}`);
    };

    determinePreferredSlug();
  }, [router, profile]);

  useEffect(() => {
    if (!profile.id || !address) return;

    if (
      profile.walletAddress &&
      address &&
      profile.walletAddress.toLocaleLowerCase() !== address.toLocaleLowerCase()
    ) {
      setNotifications({});
      runLogout();
      setTheme(initialTheme);
      document.body.setAttribute('data-theme', '');

      deleteAuthCookies();
      setProfile(initialProfile);
      disconnect();
    }
  }, [address, profile]);

  return {
    profile,
    setProfile,
    requestGetProfile: getMe,
    loading,
  };
};

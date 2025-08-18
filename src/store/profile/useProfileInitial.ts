/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { initialProfile, profileAtom } from './profile';
import { API_PATH } from '@/api/constant';
import { PREFIX_API, privateRequest } from '@/api/request';
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

    const routeCode = router.query.code;
    const currentThemeCode = profile?.refererThemeCode;

    // Ensure `routeCode` is available and not already correct
    if (routeCode !== currentThemeCode) {
      // navigate to currentThemeCode path
      if (!currentThemeCode) {
        router.replace(`/platform`);
      } else {
        router.replace(`/${currentThemeCode}`);
      }
    }
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

/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { profileAtom } from './profile';
import { API_PATH } from '@/api/constant';
import { PREFIX_API, privateRequest } from '@/api/request';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAccessToken } from '../auth';

export const useProfileInitial = () => {
  const [profile, setProfile] = useAtom(profileAtom);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  return {
    profile,
    setProfile,
    requestGetProfile: getMe,
    loading,
  };
};

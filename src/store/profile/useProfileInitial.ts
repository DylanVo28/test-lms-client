/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { profileAtom } from './profile';
import { API_PATH } from '@/api/constant';
import { PREFIX_API, privateRequest } from '@/api/request';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useProfileInitial = () => {
  const [profile, setProfile] = useAtom(profileAtom);

  const router = useRouter();
  const run = () => {
    const init = async () => {
      const res = await privateRequest(
        fetch,
        `${PREFIX_API}${API_PATH.GET_USER}`
      ).then((res) => res.json());
      setProfile({
        ...res?.data,
      });
    };
    init();
  };

  useEffect(() => {
    if (!profile) return;

    const routeCode = router.query.code;
    const currentThemeCode = profile?.refererThemeCode;

    // Ensure `routeCode` is available and not already correct
    if (typeof routeCode === 'string' && routeCode !== currentThemeCode) {
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
    requestGetProfile: run,
  };
};

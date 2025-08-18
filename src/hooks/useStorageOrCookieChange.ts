import {
  deleteAuthCookies,
  getAccessToken,
  setAuthCookies,
} from '@/store/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAtom } from 'jotai';
import { initialProfile, profileAtom } from '@/store/profile/profile';
import { notificationAtom } from '@/store/notification/notification';
import { initialTheme, themeAtom } from '@/store/theme/theme';

const useStorageOrCookieChange = () => {
  const router = useRouter();
  const [profile, setProfile] = useAtom(profileAtom);
  const [, setNotifications] = useAtom(notificationAtom);
  const [_, setTheme] = useAtom(themeAtom);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const handleStorage = () => {};

    const handleCookie = () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setProfile(initialProfile);
        setNotifications({});
        setTheme(initialTheme);
        deleteAuthCookies();
        // disconnect();

        document.body.setAttribute('data-theme', '');
      }
    };

    window.addEventListener('storage', handleStorage);

    let lastCookie = document.cookie;
    const cookieInterval = setInterval(() => {
      const currentCookie = document.cookie;
      if (currentCookie !== lastCookie) {
        lastCookie = currentCookie;
        handleCookie();
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(cookieInterval);
    };
  }, []);
};

export default useStorageOrCookieChange;

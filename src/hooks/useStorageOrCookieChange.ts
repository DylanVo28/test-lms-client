import { deleteAuthCookies, getAccessToken } from '@/store/auth';
import { notificationAtom } from '@/store/notification/notification';
import { initialProfile, profileAtom } from '@/store/profile/profile';
import { initialTheme, themeAtom } from '@/store/theme/theme';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

const useStorageOrCookieChange = () => {
  const [_profile, setProfile] = useAtom(profileAtom);
  const [, setNotifications] = useAtom(notificationAtom);
  const [_theme, setTheme] = useAtom(themeAtom);

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

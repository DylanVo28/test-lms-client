import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { getAccessToken } from '@/store/auth';
import { useEffect, useState } from 'react';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import PushNotificationLayout from '../PushNotificationLayout/PushNotificationLayout';
import { useAuth } from '@/store/auth/useAuth';
import { COLOR_THEME } from '@/utils/common';
import { useTheme } from '@/store/theme/useTheme';
import { useNotifications } from '@/store/notification/useNotification';
import { firebaseCloudMessaging } from '@/firebase/firebase';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import { initialTheme } from '@/store/theme/theme';
import LoadingBase from '@/components/UI/LoadingBase';
import { useRouter } from 'next/router';

const AppLayout = ({ children }: any) => {
  const { requestGetProfile } = useProfileInitial();
  const { requestUpdateFcmToken } = useAuth();
  const { theme } = useTheme();
  const { requestGetTheme, setTheme } = useThemeInitial();
  const { requestCheckHasNotification } = useNotifications();
  const token = getAccessToken();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  const router = useRouter();

  useEffect(() => {
    firebaseCloudMessaging.requestPermissions();
  }, []);

  useEffect(() => {
    if (token) {
      requestGetProfile();

      requestUpdateFcmToken?.run(token);
      requestCheckHasNotification?.run();
    } else {
      setTheme(initialTheme);
    }
    requestGetTheme();
  }, [token, router.query.code]);
  return (
    <main>
      <LoadingBase loading={loading} />
      {!loading && (
        <NextThemesProvider
          attribute="class"
          forcedTheme={theme?.modeTheme || 'dark'}
        >
          <NextUIProvider>{children}</NextUIProvider>
        </NextThemesProvider>
      )}
      <PushNotificationLayout />
    </main>
  );
};

export default AppLayout;

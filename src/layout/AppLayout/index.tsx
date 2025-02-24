import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { getAccessToken } from '@/store/auth';
import { useEffect } from 'react';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import PushNotificationLayout from '../PushNotificationLayout/PushNotificationLayout';
import { useAuth } from '@/store/auth/useAuth';
import { COLOR_THEME } from '@/utils/common';
import { useTheme } from '@/store/theme/useTheme';
import { useNotifications } from '@/store/notification/useNotification';
import { firebaseCloudMessaging } from '@/firebase/firebase';

const AppLayout = ({ children }: any) => {
  const { requestGetProfile } = useProfileInitial();
  const { requestUpdateFcmToken } = useAuth();
  const { theme } = useTheme();

  const { requestCheckHasNotification } = useNotifications();
  const token = getAccessToken();

  useEffect(() => {
    firebaseCloudMessaging.requestPermissions();
  }, []);

  useEffect(() => {
    if (token) {
      requestGetProfile();
      requestUpdateFcmToken?.run(token);
      requestCheckHasNotification?.run();
    }
  }, [token]);

  console.log(theme, 'theme');

  return (
    <>
      <main>
        <NextThemesProvider attribute="class" forcedTheme={theme?.colorMode}>
          <NextUIProvider>{children}</NextUIProvider>
        </NextThemesProvider>

        <PushNotificationLayout />
      </main>
    </>
  );
};

export default AppLayout;

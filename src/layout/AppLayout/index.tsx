import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { getAccessToken } from '@/store/auth';
import { useEffect } from 'react';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import PushNotificationLayout from '../PushNotificationLayout/PushNotificationLayout';
import { useAuth } from '@/store/auth/useAuth';
import { useNotifications } from '@/store/notification/useNotification';
import { firebaseCloudMessaging } from '@/firebase/firebase';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import useNavigate from '@/hooks/useNavigate';

const AppLayout = ({ children }: any) => {
  const { requestGetProfile } = useProfileInitial();
  const { requestUpdateFcmToken } = useAuth();
  const { requestCheckHasNotification } = useNotifications();
  const { requestGetTheme } = useThemeInitial();
  const token = getAccessToken();
  const { params } = useNavigate();

  useEffect(() => {
    firebaseCloudMessaging.requestPermissions();
  }, []);

  useEffect(() => {
    if (token) {
      requestGetProfile();
      requestUpdateFcmToken?.run(token);
      requestCheckHasNotification?.run();
      requestGetTheme();
    }
  }, [token, params.code]);
  return (
    <>
      <main>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <NextUIProvider>{children}</NextUIProvider>
        </NextThemesProvider>
        <PushNotificationLayout />
      </main>
    </>
  );
};

export default AppLayout;

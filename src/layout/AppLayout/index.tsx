import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { getAccessToken } from '@/store/auth';
import { useEffect } from 'react';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import PushNotificationLayout from '../PushNotificationLayout/PushNotificationLayout';
import { useAuth } from '@/store/auth/useAuth';
import { useNotifications } from '@/store/notification/useNotification';
import { firebaseCloudMessaging } from '@/firebase/firebase';

const AppLayout = ({ children }: any) => {
  const { requestGetProfile } = useProfileInitial();
  const { requestUpdateFcmToken } = useAuth();
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

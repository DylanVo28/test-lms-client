import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { getAccessToken } from '@/store/auth';
import { useEffect } from 'react';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import PushNotificationLayout from '../PushNotificationLayout/PushNotificationLayout';
import { useAuth } from '@/store/auth/useAuth';

const AppLayout = ({ children }: any) => {
  const { requestGetProfile } = useProfileInitial();
  const { requestUpdateFcmToken } = useAuth();

  const token = getAccessToken();

  useEffect(() => {
    if (token) {
      requestGetProfile();
      requestUpdateFcmToken?.run(token);
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

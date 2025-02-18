import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { getAccessToken } from '@/store/auth';
import { useEffect } from 'react';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import PushNotificationLayout from '../PushNotificationLayout/PushNotificationLayout';
import { useAuth } from '@/store/auth/useAuth';
import { COLOR_THEME } from '@/utils/common';
import { useTheme } from '@/store/theme/useTheme';

const AppLayout = ({ children }: any) => {
  const { requestGetProfile } = useProfileInitial();
  const { requestUpdateFcmToken } = useAuth();
  const { theme } = useTheme();

  const token = getAccessToken();

  useEffect(() => {
    console.log(token, 'token');

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

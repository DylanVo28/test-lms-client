import LoadingBase from '@/components/UI/LoadingBase';
import { firebaseCloudMessaging } from '@/firebase/firebase';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useAuth } from '@/store/auth/useAuth';
import { useNotifications } from '@/store/notification/useNotification';
import { useProfile } from '@/store/profile/useProfile';
import { useTheme } from '@/store/theme/useTheme';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import PushNotificationLayout from '../PushNotificationLayout/PushNotificationLayout';

const AppLayout = ({ children }: any) => {
  const { requestUpdateFcmToken } = useAuth();
  const { theme } = useTheme();
  const { requestGetTheme } = useThemeInitial();
  const { requestCheckHasNotification } = useNotifications();
  const { address } = useAccount();
  const token = useAccessToken();
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();

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
      // requestGetProfile();
      requestUpdateFcmToken?.run(token);
      requestCheckHasNotification?.run();
    }
    requestGetTheme();
  }, [token, router.query.code, profile?.id]);

  return (
    <Fragment>
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
    </Fragment>
  );
};

export default AppLayout;

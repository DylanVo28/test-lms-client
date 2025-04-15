import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Fragment, useEffect, useState } from 'react';
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
import { useProfile } from '@/store/profile/useProfile';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useAccount } from 'wagmi';

const AppLayout = ({ children }: any) => {
  const { requestGetProfile } = useProfileInitial();
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

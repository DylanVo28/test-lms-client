import LoadingBase from '@/components/UI/LoadingBase';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useAuth } from '@/store/auth/useAuth';
import { useNotifications } from '@/store/notification/useNotification';
import { useProfile } from '@/store/profile/useProfile';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import { useTheme } from '@/store/theme/useTheme';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const AppLayout = ({ children }: any) => {
  const { theme } = useTheme();
  const { requestGetTheme } = useThemeInitial();
  const { requestCheckHasNotification } = useNotifications();

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
    if (token) {
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
    </Fragment>
  );
};

export default AppLayout;

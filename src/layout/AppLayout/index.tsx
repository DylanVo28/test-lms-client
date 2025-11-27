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
import { Fragment, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';

const AppLayout = ({ children }: any) => {
  const { theme } = useTheme();
  const { requestGetTheme } = useThemeInitial();
  const { requestCheckHasNotification } = useNotifications();

  const token = useAccessToken();
  const { profile } = useProfile();

  const router = useRouter();
  const prevCodeRef = useRef<string | undefined>(undefined);
  const prevProfileIdRef = useRef<string | undefined>(undefined);
  const prevTokenRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const codeChanged = prevCodeRef.current !== router.query.code;
    const profileIdChanged = prevProfileIdRef.current !== profile?.id;
    const tokenChanged = prevTokenRef.current !== token;

    // Only call if something actually changed
    if (codeChanged || profileIdChanged || tokenChanged) {
      if (token) {
        requestCheckHasNotification?.run();
      }
      requestGetTheme();

      // Update refs
      prevCodeRef.current = router.query.code as string | undefined;
      prevProfileIdRef.current = profile?.id;
      prevTokenRef.current = token;
    }
  }, [token, router.query.code, profile?.id]);

  return (
    <Fragment>
      <NextThemesProvider
        attribute="class"
        forcedTheme={theme?.modeTheme || 'dark'}
      >
        <NextUIProvider>{children}</NextUIProvider>
      </NextThemesProvider>
    </Fragment>
  );
};

export default AppLayout;

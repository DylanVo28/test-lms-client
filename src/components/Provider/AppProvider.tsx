import { ReactElement, ReactNode } from 'react';

import AppLayout from '@/layout/AppLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';
import Head from 'next/head';
import { Toaster } from 'sonner';
import WagmiAutoReconnect from '@/components/Provider/WagmiAutoReconnect';
import dynamic from 'next/dynamic';
import {ENV} from "@/utils/env";
const WhatWagmiProvider = dynamic(
    () => import('adapter-connect').then((mod) => ({ default: mod.WhatWagmiProvider })),
    { ssr: false }
);

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

if (typeof window !== 'undefined') {
  const hasWalletConnectSession = Object.keys(window.localStorage).some((key) =>
    key.startsWith('wc@2:client:')
  );

  const hasWalletConnectParams =
    window.location.search.includes('wc') ||
    window.location.href.includes('wc%3F') ||
    window.location.hash.includes('wc');

  if (hasWalletConnectSession && hasWalletConnectParams) {
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1, // Only retry once on failure
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      networkMode: 'online', // Only fetch when online
      structuralSharing: true, // Enable structural sharing for better performance
    },
  },
});

function AppProvider({ children }: any) {
  return (
    <>
      <Head>
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content={'index,follow'} />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#476055" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="title" content="What Exchange" />
        <meta name="description" content="What Exchange" />
        <link rel="shortcut icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=2,shrink-to-fit=no"
        />
      </Head>

      <ProgressBar
        height="2px"
        color="var(--main-color)"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <main>
          <QueryClientProvider client={queryClient}>
              <WhatWagmiProvider privyKey={ENV.NEXT_PUBLIC_PRIVY_KEY || ''}>
                  <AppLayout>
                        <Toaster position="top-center" richColors />
                        <WagmiAutoReconnect />
                        {children}
                  </AppLayout>
              </WhatWagmiProvider>
          </QueryClientProvider>
      </main>
    </>
  );
}

export default AppProvider;

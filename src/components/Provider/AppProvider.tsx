import { ReactElement, ReactNode } from 'react';

import AppLayout from '@/layout/AppLayout';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';
import Head from 'next/head';
import { Toaster } from 'sonner';
import { createConfig, createStorage, http, WagmiProvider } from 'wagmi';
import { fantomTestnet } from 'wagmi/chains';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const config = createConfig({
  chains: [fantomTestnet],
  transports: {
    [fantomTestnet.id]: http('https://rpc.testnet.fantom.network/'),
  },
  ssr: false,
  storage: createStorage({
    storage:
      typeof window !== 'undefined'
        ? {
            getItem: (key) => {
              const item = window.localStorage.getItem(key);
              if (key.startsWith('wc@2:client:')) {
                return item || window.localStorage.getItem('wagmi.wallet');
              }
              if (
                window.location.href.includes('wc?') &&
                key.includes('wagmi')
              ) {
                return item || 'true';
              }
              return item;
            },
            setItem: (key, value) => window.localStorage.setItem(key, value),
            removeItem: (key) => window.localStorage.removeItem(key),
          }
        : undefined,
  }),
});

if (typeof window !== 'undefined') {
  const hasWalletConnectSession = Object.keys(window.localStorage).some((key) =>
    key.startsWith('wc@2:client:')
  );

  if (hasWalletConnectSession && window.location.href.includes('wc?')) {
    const cleanUrl = window.location.href.split('?')[0];
    window.history.replaceState({}, document.title, cleanUrl);
  }
}

const queryClient = new QueryClient();

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
        <WagmiProvider config={config}>
          <AppLayout>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider
                theme={darkTheme({
                  accentColor: '#02A6C2',
                  borderRadius: 'small',
                })}
                initialChain={fantomTestnet}
              >
                <Toaster position="top-center" richColors />
                {children}
              </RainbowKitProvider>
            </QueryClientProvider>
          </AppLayout>
        </WagmiProvider>
      </main>
    </>
  );
}

export default AppProvider;

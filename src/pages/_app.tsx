/* eslint-disable react/no-unknown-property */
import '../styles/globals.scss';
import '../styles/tailwind.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-rater/lib/react-rater.css';
import 'video.js/dist/video-js.css';
import 'videojs-hls-quality-selector';
import 'videojs-contrib-quality-levels';
import 'cropperjs/dist/cropper.css';

import { ReactElement, ReactNode } from 'react';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';
import { DefaultSeo, DefaultSeoProps } from 'next-seo';
import AppLayout from '@/layout/AppLayout';
import { appWithTranslation } from 'next-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, createStorage, http, WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  fantomTestnet,
} from 'wagmi/chains';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import nextI18nConfig from '../../next-i18next.config';
import { Toaster } from 'sonner';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const projectId = 'fc44d249918338bb571eab6da79776df';
const chains = [mainnet, polygon, optimism, arbitrum, base];

// Initialize RainbowKit with wallets
export const { connectors } = getDefaultWallets({
  appName: 'What Exchange',
  projectId,
});

// Configure wagmi client
const config = createConfig({
  // chains: [mainnet, polygon, optimism, arbitrum, base],
  chains: [fantomTestnet],
  connectors,
  transports: {
    [fantomTestnet.id]: http('https://rpc.testnet.fantom.network/'),
    // [mainnet.id]: http(),
    // [polygon.id]: http(),
    // [optimism.id]: http(),
    // [arbitrum.id]: http(),
    // [base.id]: http(),
  },
  ssr: false,
  // Enhanced storage handling for WalletConnect
  storage: createStorage({
    storage:
      typeof window !== 'undefined'
        ? {
            getItem: (key) => {
              const item = window.localStorage.getItem(key);
              // Keep WalletConnect session active
              if (key.startsWith('wc@2:client:')) {
                return item || window.localStorage.getItem('wagmi.wallet');
              }
              // Handle returning from mobile wallet
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

// Handle WalletConnect session restoration and URL cleanup
if (typeof window !== 'undefined') {
  const hasWalletConnectSession = Object.keys(window.localStorage).some((key) =>
    key.startsWith('wc@2:client:')
  );

  if (hasWalletConnectSession && window.location.href.includes('wc?')) {
    // Clean URL immediately to avoid reconnection loops
    const cleanUrl = window.location.href.split('?')[0];
    window.history.replaceState({}, document.title, cleanUrl);
  }
}

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: any) => page);

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
          rel="stylesheet"
        ></link>
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
      {/* oke */}
      <main>
        {/* <WagmiProvider config={config}>
          <AppLayout>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider
                theme={darkTheme({
                  accentColor: '#02A6C2',
                  borderRadius: 'small',
                })}
                initialChain={fantomTestnet}
              >
                <Toaster position="top-center" />
                {getLayout(<Component {...pageProps} />)}
              </RainbowKitProvider>
            </QueryClientProvider>
          </AppLayout>
        </WagmiProvider> */}
        {getLayout(<Component {...pageProps} />)}
      </main>
    </>
  );
}
// @ts-ignore
export default appWithTranslation(MyApp, nextI18nConfig);

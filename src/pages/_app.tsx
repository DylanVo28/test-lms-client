/* eslint-disable react/no-unknown-property */
import '../styles/globals.scss';
import '../styles/tailwind.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-rater/lib/react-rater.css';

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
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
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

const { connectors } = getDefaultWallets({
  appName: 'What Exchange',
  projectId: 'fc44d249918338bb571eab6da79776df',
});

const config = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum, base],
  connectors,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  ssr: false,
  storage:
    typeof window !== 'undefined'
      ? createStorage({ storage: window.localStorage })
      : undefined,
});

const queryClient = new QueryClient();

export const SEO: DefaultSeoProps = {
  titleTemplate: 'What Exchange',
  defaultTitle: 'What Exchange',
  description: 'What Exchange',
  openGraph: {
    title: 'What Exchange',
    description: 'What Exchange',
    images: [
      {
        url: 'banner-1.png',
        width: 800,
        height: 400,
        alt: 'Title Banner Alt',
      },
    ],
  },
};

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
      <DefaultSeo {...SEO} />

      <ProgressBar
        height="2px"
        color="var(--main-color)"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <AppLayout>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              theme={darkTheme({
                accentColor: '#02A6C2',
                borderRadius: 'small',
              })}
              initialChain={mainnet}
            >
              <Toaster position="top-center" />
              {getLayout(<Component {...pageProps} />)}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </AppLayout>
    </>
  );
}
// @ts-ignore
export default appWithTranslation(MyApp, nextI18nConfig);

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
import { http, WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import nextI18nConfig from '../../next-i18next.config';
import { Toaster } from 'sonner';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const config = getDefaultConfig({
  appName: 'LMS',
  projectId: 'fc44d249918338bb571eab6da79776df',
  transports: {
    [mainnet.id]: http(),
  },
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

const queryClient = new QueryClient();

export const SEO: DefaultSeoProps = {
  titleTemplate: 'LMS',
  defaultTitle: 'LMS',
  description: 'LMS',
  openGraph: {
    title: 'LMS',
    description: 'LMS',
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
        <meta name="title" content="LMS" />
        <meta name="description" content="LMS" />
        <link rel="shortcut icon" href="/static/logo-aeon.svg" />
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

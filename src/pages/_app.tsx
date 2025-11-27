/* eslint-disable react/no-unknown-property */
import '@rainbow-me/rainbowkit/styles.css';
import 'cropperjs/dist/cropper.css';
import 'quill/dist/quill.snow.css';
import 'react-rater/lib/react-rater.css';
import '../styles/globals.scss';
import '../styles/tailwind.css';
import '../styles/quill.css';

import 'video.js/dist/video-js.css';

import { ReactElement, ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // optionally enable in development

import type { NextPage } from 'next';
import { appWithTranslation } from 'next-i18next';
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1, // Only retry once on failure to avoid unnecessary requests
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      networkMode: 'online', // Only fetch when online
      structuralSharing: true, // Enable structural sharing for better performance
    },
  },
});

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: any) => page);

  return (
    <>
      {/* Ignore runtime errors from browser extensions in dev/runtime */}
      {typeof window !== 'undefined' &&
        (() => {
          const onError = (ev: ErrorEvent) => {
            const src = (ev?.filename || '') as string;
            if (src.startsWith('chrome-extension://')) {
              ev.stopImmediatePropagation();
              ev.preventDefault();
              return false;
            }
          };
          const onRejection = (ev: PromiseRejectionEvent) => {
            const reason: any = ev?.reason;
            const stack: string = reason?.stack || '';
            const msg: string = reason?.message || '';
            if (
              stack.includes('chrome-extension://') ||
              msg.includes('chrome-extension://')
            ) {
              ev.stopImmediatePropagation();
              ev.preventDefault();
              return false;
            }
          };
          window.addEventListener('error', onError, { capture: true });
          window.addEventListener('unhandledrejection', onRejection, {
            capture: true,
          });
          return null;
        })()}
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
      <QueryClientProvider client={queryClient}>
        <main>{getLayout(<Component {...pageProps} />)}</main>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </>
  );
}
export default appWithTranslation(MyApp);

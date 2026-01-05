/* eslint-disable react/no-unknown-property */
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
import type { AppProps } from 'next/app';
import Head from 'next/head';
import "@orderly.network/ui/dist/styles.css";
import PageProgressBar from '@/components/UI/PageProgressBar';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: any) => page);
  //
  // useEffect(() => {
  //   if (typeof window === 'undefined') return;
  //
  //   // Wrap fetch to catch errors from Coinbase metrics and other external APIs
  //   // Only wrap if not already wrapped (check for a custom property)
  //   if ((window.fetch as any).__wrapped) return;
  //
  //   const originalFetch = window.fetch.bind(window);
  //   (window.fetch as any).__wrapped = true;
  //
  //   window.fetch = async (...args) => {
  //     // Extract URL from arguments
  //     const url = typeof args[0] === 'string'
  //       ? args[0]
  //       : args[0] instanceof Request
  //         ? args[0].url
  //         : args[0] instanceof URL
  //         ? args[0].toString()
  //         : (args[0] as any)?.url || '';
  //
  //
  //     // Check if this is a Coinbase metrics request - return fake response immediately
  //     if (
  //       url.includes('cca-lite.coinbase.com') ||
  //       url.includes('coinbase.com/metrics')
  //     ) {
  //       // Return a fake successful response to prevent errors
  //       return Promise.resolve(new Response(null, {
  //         status: 200,
  //         statusText: 'OK',
  //         headers: new Headers(),
  //       }));
  //     }
  //
  //     // For other requests, try to call original fetch with error handling
  //     try {
  //       return await originalFetch(...args);
  //     } catch (error: any) {
  //       // If error is from chrome extension or failed fetch, return fake response
  //       if (
  //         error?.message?.includes('chrome-extension://') ||
  //         error?.stack?.includes('chrome-extension://') ||
  //         error?.message?.includes('Failed to fetch')
  //       ) {
  //         return new Response(null, {
  //           status: 0,
  //           statusText: 'Ignored',
  //         });
  //       }
  //
  //       // Re-throw other errors normally
  //       throw error;
  //     }
  //   };
  //
  //   const onError = (ev: ErrorEvent) => {
  //     const src = (ev?.filename || '') as string;
  //     const message = ev?.message || '';
  //
  //     if (
  //       src.startsWith('chrome-extension://') ||
  //       message.includes('cca-lite.coinbase.com') ||
  //       message.includes('coinbase.com/metrics') ||
  //       message.includes('Failed to fetch')
  //     ) {
  //       ev.stopImmediatePropagation();
  //       ev.preventDefault();
  //       return false;
  //     }
  //   };
  //
  //   const onRejection = (ev: PromiseRejectionEvent) => {
  //     const reason: any = ev?.reason;
  //     const stack: string = reason?.stack || '';
  //     const msg: string = reason?.message || '';
  //     const url: string = reason?.url || '';
  //
  //     if (
  //       stack.includes('chrome-extension://') ||
  //       msg.includes('chrome-extension://') ||
  //       msg.includes('cca-lite.coinbase.com') ||
  //       msg.includes('coinbase.com/metrics') ||
  //       msg.includes('Failed to fetch') ||
  //       url.includes('cca-lite.coinbase.com') ||
  //       url.includes('coinbase.com/metrics')
  //     ) {
  //       ev.stopImmediatePropagation();
  //       ev.preventDefault();
  //       return false;
  //     }
  //   };
  //
  //   window.addEventListener('error', onError, { capture: true });
  //   window.addEventListener('unhandledrejection', onRejection, {
  //     capture: true,
  //   });
  // }, []);

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

      <PageProgressBar />

      <QueryClientProvider client={queryClient}>

        <main>{getLayout(<Component {...pageProps} />)}</main>

        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </>
  );
}
export default appWithTranslation(MyApp);

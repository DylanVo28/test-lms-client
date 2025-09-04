/* eslint-disable react/no-unknown-property */
import '@rainbow-me/rainbowkit/styles.css';
import 'cropperjs/dist/cropper.css';
import 'quill/dist/quill.snow.css';
import 'react-rater/lib/react-rater.css';
import '../styles/globals.scss';
import '../styles/tailwind.css';
import 'video.js/dist/video-js.css';

import { ReactElement, ReactNode } from 'react';

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
      <main>{getLayout(<Component {...pageProps} />)}</main>
    </>
  );
}
export default appWithTranslation(MyApp);

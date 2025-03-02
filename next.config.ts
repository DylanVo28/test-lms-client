import type { NextConfig } from 'next';
const { i18n } = require('./next-i18next.config');

const nextConfig: NextConfig = {
  swcMinify: true,
  i18n,
  output: 'standalone',
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    APP_API_URL: process.env.NEXT_PUBLIC_APP_API_URL,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  httpAgentOptions: {
    keepAlive: false,
  },
  images: {
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // async rewrites() {
  //   return [
  //     {
  //       source: '/:code',
  //       destination: '/',
  //     },
  //     {
  //       source: '/',
  //       destination: '/',
  //     },
  //     {
  //       source: '/:code/lesson/:id',
  //       destination: '/lesson/:id',
  //     },
  //     {
  //       source: '/lesson/:id',
  //       destination: '/lesson/:id',
  //     },

  //     {
  //       source: '/:code/course/:id',
  //       destination: '/course/:id',
  //     },
  //     {
  //       source: '/course/:id',
  //       destination: '/course/:id',
  //     },
  //     // {
  //     //   source: '/:id/lesson/:lessonId',
  //     //   destination: '/lesson/:id/:lessonId',
  //     // },
  //     // {
  //     //   source: '/lesson/:lessonId',
  //     //   destination: '/lesson/:lessonId',
  //     // },
  //     // {
  //     //   source: '/:id/course/:courseId',
  //     //   destination: '/course/:courseId',
  //     // },
  //   ];
  // },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/platform',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

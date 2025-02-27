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

  // async rewrites() {
  //   return [
  //     {
  //       source: '/:code/',
  //       destination: '/',
  //     },
  //     {
  //       source: '/:code/course',
  //       destination: '/course',
  //     },
  //     {
  //       source: '/:code/course/:id',
  //       destination: '/course/:id',
  //     },
  //     {
  //       source: '/:code/course-search',
  //       destination: '/course-search',
  //     },
  //     {
  //       source: '/:code/create-course',
  //       destination: '/create-course',
  //     },
  //     {
  //       source: '/:code/create-course/:id',
  //       destination: '/create-course/:id',
  //     },
  //     {
  //       source: '/:code/lesson',
  //       destination: '/lesson',
  //     },
  //     {
  //       source: '/:code/lesson/:id',
  //       destination: '/lesson/:id',
  //     },
  //     {
  //       source: '/:code/list-course',
  //       destination: '/list-course',
  //     },
  //     {
  //       source: '/:code/my-learning',
  //       destination: '/my-learning',
  //     },
  //     {
  //       source: '/:code/my-profile',
  //       destination: '/my-profile',
  //     },
  //   ];
  // },
};

export default nextConfig;

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

  async rewrites() {
    return [
      {
        source: '/:id',
        destination: '/',
      },
      {
        source: '/',
        destination: '/',
      },
      {
        source: '/:id/lesson/:lessonId',
        destination: '/lesson/:lessonId',
      },
      {
        source: '/lesson/:lessonId',
        destination: '/lesson/:lessonId',
      },
      // {
      //   source: '/:id/lesson/:lessonId',
      //   destination: '/lesson/:id/:lessonId',
      // },
      // {
      //   source: '/lesson/:lessonId',
      //   destination: '/lesson/:lessonId',
      // },
      // {
      //   source: '/:id/course/:courseId',
      //   destination: '/course/:courseId',
      // },
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

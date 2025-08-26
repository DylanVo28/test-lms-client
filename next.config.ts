import type { NextConfig } from 'next';
import withTM from 'next-transpile-modules';

const { i18n } = require('./next-i18next.config');

const withTranspile = withTM(['@noble/ed25519', 'bs58']);

const nextConfig: NextConfig = {
  i18n,
  output: 'standalone',

  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    APP_API_URL: process.env.NEXT_PUBLIC_APP_API_URL,
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
  // Remove COOP/COEP to avoid blocking cross-origin requests on Vercel SW/runtime
  reactStrictMode: true,
  transpilePackages: ['@noble/ed25519', 'bs58'],
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
    };

    // Force resolution to use ESM versions
    config.resolve.alias = {
      ...config.resolve.alias,
      '@noble/ed25519': require.resolve('@noble/ed25519'),
    };

    // Handle module resolution
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.mjs': ['.mjs', '.mts'],
      '.cjs': ['.cjs', '.cts'],
    };

    return config;
  },
};

export default withTranspile(nextConfig);

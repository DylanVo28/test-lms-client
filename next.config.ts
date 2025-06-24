import type { NextConfig } from 'next';
import withTM from 'next-transpile-modules';
const { i18n } = require('./next-i18next.config');

const withTranspile = withTM([
  '@noble/ed25519',
  '@orderly.network/default-evm-adapter',
  '@orderly.network/default-solana-adapter',
  '@orderly.network/hooks',
  '@orderly.network/core',
  '@orderly.network/net',
  '@orderly.network/utils',
  '@orderly.network/perp',
  '@orderly.network/types',
  '@orderly.network/web3-provider-ethers',
  'bs58',
]);

const nextConfig: NextConfig = {
  i18n,
  output: 'standalone',
  experimental: {
    esmExternals: false,
  },
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
  reactStrictMode: true,
  transpilePackages: [
    '@noble/ed25519',
    '@orderly.network/default-evm-adapter',
    '@orderly.network/default-solana-adapter',
    '@orderly.network/hooks',
    '@orderly.network/core',
    '@orderly.network/net',
    '@orderly.network/utils',
    '@orderly.network/perp',
    '@orderly.network/types',
    '@orderly.network/web3-provider-ethers',
    'bs58',
  ],
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
    };

    // Force resolution to use ESM versions
    config.resolve.alias = {
      ...config.resolve.alias,
      '@orderly.network/hooks': require.resolve(
        '@orderly.network/hooks/dist/index.mjs'
      ),
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

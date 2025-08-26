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
  reactStrictMode: true,
  transpilePackages: ['@noble/ed25519', 'bs58'],

  // External packages for server components to prevent viem from being bundled on server
  serverComponentsExternalPackages: ['viem', 'wagmi', '@wagmi/core'],

  // Ensure i18n files are properly bundled
  experimental: {
    esmExternals: false,
  },

  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
    };

    // Force resolution to use server/client safe variants
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

    // Ensure i18n files are properly handled
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
      include: /locales/,
    });

    // Optimize viem imports for better tree-shaking
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            viem: {
              test: /[\\/]node_modules[\\/]viem[\\/]/,
              name: 'viem',
              chunks: 'all',
              priority: 20,
            },
            wagmi: {
              test: /[\\/]node_modules[\\/]wagmi[\\/]/,
              name: 'wagmi',
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };
    }

    // External viem on server to prevent file handle issues
    if (isServer) {
      config.externals = config.externals || [];
      if (typeof config.externals === 'function') {
        const originalExternals = config.externals;
        config.externals = (context: any, request: any, callback: any) => {
          if (request?.startsWith('viem') || request?.startsWith('wagmi')) {
            return callback(null, `commonjs ${request}`);
          }
          return originalExternals(context, request, callback);
        };
      } else if (Array.isArray(config.externals)) {
        config.externals.push('viem', 'wagmi');
      }
    }

    return config;
  },
};

export default withTranspile(nextConfig);

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  APP_API_URL:
    process.env.NEXT_PUBLIC_APP_API_URL || process.env.APP_API_URL || '',
  NEXT_PUBLIC_PRIVY_KEY: process.env.NEXT_PUBLIC_PRIVY_KEY || '',
};

export { ENV };

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  APP_API_URL:
    process.env.NEXT_PUBLIC_APP_API_URL || process.env.APP_API_URL || '',
};

export { ENV };

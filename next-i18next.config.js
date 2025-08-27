module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi', 'zh-CN'],
    localeDetection: true,
  },
  react: {
    useSuspense: false,
  },
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};

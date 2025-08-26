module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi', 'zh-CN'],
    localeDetection: true,
  },
  react: {
    useSuspense: false,
  },
  // Ensure proper loading of translation files
  load: 'languageOnly',
  // Add fallback locale
  fallbackLng: 'en',
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
  // Ensure proper namespace handling
  defaultNS: 'common',
  // Add interpolation options
  interpolation: {
    escapeValue: false,
  },
  // Add proper locale path resolution
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
};

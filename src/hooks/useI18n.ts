import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

// Custom hook for better i18n handling with fallbacks
export const useI18n = (namespace: string = 'common') => {
  const { t, i18n, ready } = useTranslation(namespace);
  const [isTranslationsLoaded, setIsTranslationsLoaded] = useState(false);

  useEffect(() => {
    if (ready && i18n.isInitialized) {
      setIsTranslationsLoaded(true);
    }
  }, [ready, i18n.isInitialized]);

  // Enhanced translation function with fallback
  const translate = (key: string, options?: any, fallback?: string) => {
    if (!ready || !isTranslationsLoaded) {
      return fallback || key;
    }

    const translation = t(key, options);
    
    // If translation returns the key itself, it means the key wasn't found
    if (translation === key) {
      console.warn(`Translation key not found: ${key} for locale: ${i18n.language}`);
      
      // Try to get from fallback locale
      if (i18n.language !== 'en') {
        const fallbackTranslation = i18n.getFixedT('en', namespace);
        const fallbackResult = fallbackTranslation(key, options);
        if (fallbackResult !== key) {
          return fallbackResult;
        }
      }
      
      return fallback || key;
    }

    return translation;
  };

  // Check if a specific key exists
  const hasKey = (key: string): boolean => {
    if (!ready || !isTranslationsLoaded) return false;
    const translation = t(key);
    return translation !== key;
  };

  // Get current language
  const currentLanguage = i18n.language || 'en';

  // Change language with error handling
  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('i18nextLng', lang);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return {
    t: translate,
    i18n,
    ready: isTranslationsLoaded,
    currentLanguage,
    changeLanguage,
    hasKey,
    isInitialized: i18n.isInitialized,
  };
};

// Hook specifically for banner translations with fallbacks
export const useBannerTranslations = () => {
  const { t, ready, currentLanguage } = useI18n('common');

  const getBannerTitle = () => {
    if (!ready) return 'Web Development Courses';
    
    const title = t('banner.defaultTitle');
    if (title === 'banner.defaultTitle') {
      // Fallback to hardcoded values if translation fails
      const fallbacks = {
        en: 'Web Development Courses',
        vi: 'Khóa học Phát triển Web',
        'zh-CN': 'Web 开发课程',
      };
      return fallbacks[currentLanguage as keyof typeof fallbacks] || fallbacks.en;
    }
    
    return title;
  };

  const getBannerDescription = () => {
    if (!ready) return 'With one of our online web development courses, you can explore different areas of this in-demand field.';
    
    const description = t('banner.defaultDescription');
    if (description === 'banner.defaultDescription') {
      const fallbacks = {
        en: 'With one of our online web development courses, you can explore different areas of this in-demand field.',
        vi: 'Với các khóa học phát triển web trực tuyến, bạn có thể khám phá nhiều lĩnh vực hấp dẫn của ngành đang được quan tâm này.',
        'zh-CN': '通过我们的在线 Web 开发课程，您可以探索这一热门领域的不同方向。',
      };
      return fallbacks[currentLanguage as keyof typeof fallbacks] || fallbacks.en;
    }
    
    return description;
  };

  return {
    title: getBannerTitle(),
    description: getBannerDescription(),
    ready,
    currentLanguage,
  };
};

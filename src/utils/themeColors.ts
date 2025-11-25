import { CustomColors, DefaultThemeColor } from '@/store/theme/theme';

export const applyCustomColors = (customColors?: CustomColors) => {
  if (typeof window === 'undefined') return;

  const colors = customColors || DefaultThemeColor;
  const root = document.documentElement;

  // Apply custom colors to CSS variables
  root.style.setProperty('--main-color', colors.primary);
  root.style.setProperty('--theme-main', colors.primary);
  root.style.setProperty('--theme-main-60', `${colors.primary}60`);
  root.style.setProperty('--theme-main-20', `${colors.primary}20`);
  root.style.setProperty('--theme-main-10', `${colors.primary}10`);

  // Apply background colors
  root.style.setProperty('--theme-background', colors.background);
  root.style.setProperty('--theme-card', colors.card);

  // Apply to additional theme variables that should use primary color
  root.style.setProperty('--theme-secondary', colors.secondary);
  root.style.setProperty('--theme-secondary-10', `${colors.secondary}10`);
  root.style.setProperty('--theme-secondary-50', `${colors.secondary}50`);

  // Apply text colors
  root.style.setProperty('--theme-letter', colors.text);
  root.style.setProperty('--theme-letter-10', `${colors.text}10`);
  root.style.setProperty('--theme-letter-20', `${colors.text}20`);
  root.style.setProperty('--theme-letter-30', `${colors.text}30`);
  root.style.setProperty('--theme-letter-40', `${colors.text}40`);
  root.style.setProperty('--theme-letter-50', `${colors.text}50`);
  root.style.setProperty('--theme-letter-60', `${colors.text}60`);
  root.style.setProperty('--theme-letter-70', `${colors.text}70`);
  root.style.setProperty('--theme-letter-80', `${colors.text}80`);

  console.log('Applied custom colors:', colors);
};

const FORCE_PLATFORM_THEME_KEY = 'force-platform-theme';

export const resetToDefaultColors = () => {
  if (typeof window === 'undefined') return;

  applyCustomColors(DefaultThemeColor);
};

export const markForcePlatformTheme = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(FORCE_PLATFORM_THEME_KEY, 'true');
};

export const consumeForcePlatformThemeFlag = () => {
  if (typeof window === 'undefined') return false;
  const shouldForce =
    sessionStorage.getItem(FORCE_PLATFORM_THEME_KEY) === 'true';
  if (shouldForce) {
    sessionStorage.removeItem(FORCE_PLATFORM_THEME_KEY);
  }
  return shouldForce;
};

export const getCustomColorsFromTheme = (themeColor: any): CustomColors => {
  // Handle if themeColor is already CustomColors object
  if (themeColor && typeof themeColor === 'object' && themeColor.primary) {
    return themeColor as CustomColors;
  }

  // Handle if themeColor is a JSON string
  if (typeof themeColor === 'string') {
    try {
      const parsed = JSON.parse(themeColor);
      if (parsed && typeof parsed === 'object' && parsed.primary) {
        return parsed as CustomColors;
      }
    } catch (error) {
      console.warn('Failed to parse theme color:', error);
    }
  }

  // Return default colors if no valid custom colors found
  return DefaultThemeColor;
};

import { CustomColors } from '@/store/theme/theme';

export interface ThemePreviewData {
  title: string;
  description: string;
  topics: string[];
  banner: string;
  logo: string;
  color: CustomColors;
}

export const THEME_PREVIEW_KEY = 'theme_preview_data';
export const THEME_PREVIEW_MODE_KEY = 'theme_preview_mode';

export const saveThemePreview = (data: ThemePreviewData) => {
  localStorage.setItem(THEME_PREVIEW_KEY, JSON.stringify(data));
};

export const getThemePreview = (): ThemePreviewData | null => {
  const data = localStorage.getItem(THEME_PREVIEW_KEY);
  if (!data) return null;
  return JSON.parse(data);
};

export const clearThemePreview = () => {
  localStorage.removeItem(THEME_PREVIEW_KEY);
};

export const isPreviewMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('preview') === 'true';
};

export const setPreviewMode = (enable: boolean) => {
  localStorage.setItem(THEME_PREVIEW_MODE_KEY, enable ? 'true' : 'false');
};

import { useEffect } from 'react';
import { getThemePreview, isPreviewMode } from '@/utils/theme-preview';
import { applyCustomColors } from '@/utils/themeColors';

export const useThemePreview = () => {
  useEffect(() => {
    if (isPreviewMode()) {
      const previewData = getThemePreview();
      if (previewData) {
        // Apply theme colors
        applyCustomColors(previewData.color);

        // Update other theme elements
        const updateThemeElements = () => {
          // Update title
          document.title = previewData.title || document.title;

          // Update description meta tag
          let metaDescription = document.querySelector(
            'meta[name="description"]'
          );
          if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
          }
          metaDescription.setAttribute(
            'content',
            previewData.description || ''
          );

          // Update logo
          const logoElements = document.querySelectorAll('img[alt="logo"]');
          logoElements.forEach((element: any) => {
            if (previewData.logo) {
              element.src = previewData.logo;
            }
          });

          // Update banner
          const bannerElements = document.querySelectorAll('.banner-image');
          bannerElements.forEach((element: any) => {
            if (previewData.banner) {
              element.style.backgroundImage = `url(${previewData.banner})`;
            }
          });
        };

        // Run once and after DOM updates
        updateThemeElements();
        setTimeout(updateThemeElements, 1000); // Run again after 1s for dynamic content
      }
    }
  }, []);

  return {
    isPreviewMode: isPreviewMode(),
    previewData: isPreviewMode() ? getThemePreview() : null,
  };
};

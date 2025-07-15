declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

let googleTranslateInstance: any = null;
let isGoogleTranslateLoaded = false;
let isGoogleTranslateReady = false;

export const loadGoogleTranslateScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isGoogleTranslateLoaded) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isGoogleTranslateLoaded = true;
      console.log('Google Translate script loaded successfully');
      resolve();
    };

    script.onerror = () => {
      console.error('Failed to load Google Translate script');
      reject(new Error('Failed to load Google Translate script'));
    };

    document.head.appendChild(script);
  });
};

export const initializeGoogleTranslate = (): void => {
  console.log('Initializing Google Translate...');
  if (
    typeof window !== 'undefined' &&
    window.google &&
    window.google.translate
  ) {
    try {
      googleTranslateInstance = new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
      isGoogleTranslateReady = true;
      console.log('Google Translate initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Translate:', error);
    }
  } else {
    console.log('Google Translate API not available yet, retrying...');
    setTimeout(() => {
      initializeGoogleTranslate();
    }, 500);
  }
};

export const translatePage = (targetLanguage: string): void => {
  console.log(`Attempting to translate page to: ${targetLanguage}`);

  if (typeof window === 'undefined') {
    console.log('Window is undefined, skipping translation');
    return;
  }

  if (!isGoogleTranslateReady) {
    console.log('Google Translate not ready, retrying in 1 second...');
    setTimeout(() => translatePage(targetLanguage), 1000);
    return;
  }

  const googleTranslateCombo = document.querySelector(
    '.goog-te-combo'
  ) as HTMLSelectElement;

  if (targetLanguage === 'en') {
    console.log('Restoring to original language (English)');

    const googleTranslateFrame = document.querySelector(
      '.goog-te-banner-frame'
    ) as HTMLIFrameElement;
    if (googleTranslateFrame) {
      try {
        const restoreButton =
          googleTranslateFrame.contentDocument?.querySelector(
            '.goog-te-banner .restore'
          ) as HTMLElement;
        if (restoreButton) {
          restoreButton.click();
          console.log('Clicked restore button');
          return;
        }
      } catch (error) {
        console.log('Could not access restore button:', error);
      }
    }

    if (googleTranslateCombo) {
      googleTranslateCombo.value = '';
      googleTranslateCombo.dispatchEvent(new Event('change'));
      console.log('Reset combo to original language');
    }
    return;
  }

  if (googleTranslateCombo) {
    console.log(`Setting translation combo to: ${targetLanguage}`);
    googleTranslateCombo.value = targetLanguage;
    googleTranslateCombo.dispatchEvent(new Event('change'));
    console.log('Translation triggered');
  } else {
    console.log('Google Translate combo not found, retrying...');
    setTimeout(() => translatePage(targetLanguage), 500);
  }
};

export const setupGoogleTranslate = async (): Promise<void> => {
  try {
    if (typeof window === 'undefined') {
      console.log('Server-side rendering, skipping Google Translate setup');
      return;
    }

    console.log('Setting up Google Translate...');

    window.googleTranslateElementInit = initializeGoogleTranslate;

    if (!document.getElementById('google_translate_element')) {
      const translateElement = document.createElement('div');
      translateElement.id = 'google_translate_element';
      translateElement.style.display = 'none';
      document.body.appendChild(translateElement);
      console.log('Created Google Translate element');
    }

    await loadGoogleTranslateScript();

    setTimeout(() => {
      initializeGoogleTranslate();
    }, 500);

    setTimeout(() => {
      hideGoogleTranslateElements();
    }, 1000);
  } catch (error) {
    console.error('Error setting up Google Translate:', error);
  }
};

export const hideGoogleTranslateElements = (): void => {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  style.id = 'google-translate-styles';

  if (document.getElementById('google-translate-styles')) {
    return;
  }

  style.textContent = `
    .goog-te-banner-frame,
    .goog-te-gadget,
    .goog-te-combo,
    .skiptranslate,
    .goog-te-spinner-pos,
    .goog-te-balloon-frame {
      display: none !important;
      visibility: hidden !important;
    }
    
    body {
      top: 0 !important;
      position: static !important;
    }
    
    .goog-te-banner-frame.skiptranslate {
      display: none !important;
    }
    
    #google_translate_element {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
  console.log('Google Translate elements hidden');
};

export const getTranslateStatus = (): {
  isLoaded: boolean;
  isReady: boolean;
} => {
  return {
    isLoaded: isGoogleTranslateLoaded,
    isReady: isGoogleTranslateReady,
  };
};

import { translatePage, getTranslateStatus } from './googleTranslate';

export const debugTranslation = () => {
  console.log('=== Google Translate Debug Info ===');

  const status = getTranslateStatus();
  console.log('Status:', status);

  const translateElement = document.getElementById('google_translate_element');
  console.log('Translate element exists:', !!translateElement);

  const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
  console.log('Translate combo exists:', !!combo);

  if (combo) {
    console.log(
      'Available languages in combo:',
      Array.from(combo.options).map((opt) => ({
        value: opt.value,
        text: opt.text,
      }))
    );
    console.log('Current combo value:', combo.value);
  }

  const iframe = document.querySelector('.goog-te-banner-frame');
  console.log('Banner frame exists:', !!iframe);

  const scripts = Array.from(document.scripts).filter(
    (script) =>
      script.src.includes('translate.google.com') ||
      script.src.includes('translate_a')
  );
  console.log('Google Translate scripts loaded:', scripts.length);

  console.log('Window.google exists:', !!(window as any).google);
  console.log(
    'Window.google.translate exists:',
    !!(window as any).google?.translate
  );

  console.log('=== End Debug Info ===');
};

export const testVietnameseTranslation = () => {
  console.log('Testing Vietnamese translation...');
  debugTranslation();

  setTimeout(() => {
    console.log('Attempting Vietnamese translation...');
    translatePage('vi');

    setTimeout(() => {
      console.log('After translation attempt:');
      debugTranslation();
    }, 2000);
  }, 1000);
};

export const forceTranslateVietnamese = () => {
  const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
  if (combo) {
    console.log('Found combo, setting to Vietnamese (vi)');
    combo.value = 'vi';
    combo.dispatchEvent(new Event('change', { bubbles: true }));

    setTimeout(() => {
      const newValue = combo.value;
      console.log('Combo value after change:', newValue);

      if (newValue === 'vi') {
        console.log('✅ Successfully set to Vietnamese');
      } else {
        console.log('❌ Failed to set to Vietnamese');
      }
    }, 1000);
  } else {
    console.log('❌ Google Translate combo not found');
  }
};

if (typeof window !== 'undefined') {
  (window as any).debugTranslation = debugTranslation;
  (window as any).testVietnameseTranslation = testVietnameseTranslation;
  (window as any).forceTranslateVietnamese = forceTranslateVietnamese;
}

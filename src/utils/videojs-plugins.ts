let pluginsLoaded = false;

export const loadVideoJSPlugins = async () => {
  if (typeof window === 'undefined' || pluginsLoaded) {
    return;
  }

  try {
    await Promise.all([
      import('videojs-contrib-quality-levels' as any),
      import('videojs-hls-quality-selector' as any),
    ]);
    pluginsLoaded = true;
  } catch (error) {
    console.warn('Failed to load VideoJS plugins:', error);
  }
};

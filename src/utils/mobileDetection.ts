export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent);
};

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /iPad|iPhone|iPod/.test(userAgent);
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /Android/.test(userAgent);
};

export const isMetaMaskInAppBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return userAgent.includes('MetaMask');
};

export const isWalletConnectSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  const supportedBrowsers = [
    'Chrome',
    'Safari',
    'Firefox',
    'Edge',
    'Opera'
  ];
  
  return supportedBrowsers.some(browser => userAgent.includes(browser));
};

export const getOptimalConnectionMethod = (): 'injected' | 'walletConnect' | 'both' => {
  if (isMobile()) {
    if (isMetaMaskInAppBrowser()) {
      return 'injected';
    }
    return 'walletConnect';
  }
  return 'both';
};

export const shouldUseWalletConnect = (): boolean => {
  const method = getOptimalConnectionMethod();
  return method === 'walletConnect' || method === 'both';
};

export const shouldUseInjected = (): boolean => {
  const method = getOptimalConnectionMethod();
  return method === 'injected' || method === 'both';
};

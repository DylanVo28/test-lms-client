import { isMobile, isMetaMaskInAppBrowser, getOptimalConnectionMethod } from '@/utils/mobileDetection';

export interface ConnectionError {
  code: string;
  message: string;
  userMessage: string;
  shouldRetry: boolean;
}

export class MobileWalletService {
  static detectConnectionIssues(): ConnectionError[] {
    const issues: ConnectionError[] = [];
    
    if (isMobile() && !isMetaMaskInAppBrowser()) {
      const method = getOptimalConnectionMethod();
      if (method === 'injected') {
        issues.push({
          code: 'MOBILE_INJECTED_UNSUPPORTED',
          message: 'Mobile browser detected but injected connector not optimal',
          userMessage: 'Consider using WalletConnect for better mobile experience',
          shouldRetry: false,
        });
      }
    }
    
    return issues;
  }

  static getConnectionRecommendation(): {
    method: 'injected' | 'walletConnect' | 'both';
    reason: string;
    priority: 'high' | 'medium' | 'low';
  } {
    if (isMobile()) {
      if (isMetaMaskInAppBrowser()) {
        return {
          method: 'injected',
          reason: 'MetaMask in-app browser detected - use injected connector',
          priority: 'high',
        };
      }
      
      return {
        method: 'walletConnect',
        reason: 'Mobile browser detected - WalletConnect provides better UX',
        priority: 'high',
      };
    }
    
    return {
      method: 'both',
      reason: 'Desktop browser - both connectors available',
      priority: 'medium',
    };
  }

  static handleConnectionError(error: any): ConnectionError {
    const errorMessage = error?.message || 'Unknown error occurred';
    
    if (errorMessage.includes('User rejected')) {
      return {
        code: 'USER_REJECTED',
        message: errorMessage,
        userMessage: 'Connection was cancelled by user',
        shouldRetry: false,
      };
    }
    
    if (errorMessage.includes('No provider')) {
      return {
        code: 'NO_PROVIDER',
        message: errorMessage,
        userMessage: 'No wallet provider found. Please install MetaMask or use WalletConnect',
        shouldRetry: false,
      };
    }
    
    if (errorMessage.includes('Network error') || errorMessage.includes('timeout')) {
      return {
        code: 'NETWORK_ERROR',
        message: errorMessage,
        userMessage: 'Network connection issue. Please check your internet and try again',
        shouldRetry: true,
      };
    }
    
    if (errorMessage.includes('Chain not supported')) {
      return {
        code: 'CHAIN_NOT_SUPPORTED',
        message: errorMessage,
        userMessage: 'This network is not supported. Please switch to Fantom Testnet',
        shouldRetry: false,
      };
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: errorMessage,
      userMessage: 'An unexpected error occurred. Please try again',
      shouldRetry: true,
    };
  }

  static getRetryStrategy(error: ConnectionError): {
    shouldRetry: boolean;
    delay: number;
    maxRetries: number;
  } {
    if (!error.shouldRetry) {
      return { shouldRetry: false, delay: 0, maxRetries: 0 };
    }
    
    switch (error.code) {
      case 'NETWORK_ERROR':
        return { shouldRetry: true, delay: 2000, maxRetries: 3 };
      case 'UNKNOWN_ERROR':
        return { shouldRetry: true, delay: 1000, maxRetries: 2 };
      default:
        return { shouldRetry: false, delay: 0, maxRetries: 0 };
    }
  }

  static getMobileOptimizationTips(): string[] {
    const tips: string[] = [];
    
    if (isMobile()) {
      tips.push('Use WalletConnect for seamless mobile experience');
      tips.push('Ensure you have a compatible wallet app installed');
      tips.push('Keep your wallet app updated to the latest version');
      
      if (isMetaMaskInAppBrowser()) {
        tips.push('You\'re using MetaMask in-app browser - this provides the best experience');
      } else {
        tips.push('Consider installing MetaMask for better integration');
      }
    }
    
    return tips;
  }
}

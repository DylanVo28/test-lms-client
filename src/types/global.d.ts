// Global type declarations for viem cache and other global variables

declare global {
  interface Window {
    ethereum?: any;
    __VIEM_CACHE__?: any;
    openModalPrivyConnect : ()=>void;
    openModalPrivyWallet: () => void;
  }
}

// Export to make this a module
export {};

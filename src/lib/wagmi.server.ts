// Server-safe shim: export no-op hooks to avoid loading wagmi core on Vercel SSR
export const WagmiProvider: any = ({ children }: any) => children;

export const useAccount = () => ({ address: undefined, isConnected: false });
export const useDisconnect = () => ({ disconnect: () => {} });
export const useSignMessage = () => ({ signMessageAsync: async () => {} });
export const useConnectorClient = () => ({ data: undefined });

export const Config = {} as any;

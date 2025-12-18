'use client';

import { WagmiProvider, } from 'wagmi';
import {PrivyProvider, usePrivy} from '@privy-io/react-auth';
import {config} from "./config";
import {ModalPrivyConnect} from "./ModalPrivyConnect";
import {ModalPrivyWallet} from "./ModalPrivyWallets";

export default function WhatWagmiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const privyKey=process.env.NEXT_PUBLIC_PRIVY_KEY || ''
  return (
    <PrivyProvider
      appId={privyKey}
      config={{
        loginMethods: ['email', 'google', 'twitter', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#3B82F6',
          walletList: ['metamask', 'rainbow', 'wallet_connect'],
          walletChainType: 'ethereum-and-solana',
        },
      }}
    >
      <WagmiProvider config={config}>
          {children}
          <ModalPrivyConnect />
          <ModalPrivyWallet/>
      </WagmiProvider>
    </PrivyProvider>
  );
}


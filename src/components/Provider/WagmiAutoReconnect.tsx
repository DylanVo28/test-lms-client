'use client';

import { useEffect } from 'react';
import { useAccount, useReconnect } from 'wagmi';

export default function WagmiAutoReconnect() {
  const { status } = useAccount();
  const { reconnect } = useReconnect();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasWalletConnectSession = Object.keys(window.localStorage).some(
      (key) => key.startsWith('wc@2:client:')
    );

    const shouldReconnect =
      window.localStorage.getItem('wagmi.autoReconnect') === '1' ||
      hasWalletConnectSession;

    if (shouldReconnect && status === 'disconnected') {
      reconnect();
    }
  }, [status, reconnect]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (status === 'connected') {
      window.localStorage.setItem('wagmi.autoReconnect', '1');
    } else if (status === 'disconnected') {
      window.localStorage.removeItem('wagmi.autoReconnect');
    }
  }, [status]);

  return null;
}

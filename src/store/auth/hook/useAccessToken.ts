import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { getAccessToken } from '..';
import { getCookie } from 'cookies-next';

const useAccessToken = () => {
  const { address } = useAccount();
  // Initialize with cookie value immediately
  const [accessToken, setAccessToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return (getCookie('accessToken') as string) || '';
    }
    return '';
  });

  useEffect(() => {
    // Check cookie immediately on mount and when address changes
    const fetchAccessToken = () => {
      const token = getCookie('accessToken');
      if (token && token !== accessToken) {
        setAccessToken(token as string);
      }
    };

    // Fetch immediately
    fetchAccessToken();

    // Also listen for storage changes (in case token is set elsewhere)
    const handleStorageChange = () => {
      fetchAccessToken();
    };

    window.addEventListener('storage', handleStorageChange);

    // Check periodically but with shorter interval for updates
    const intervalId = setInterval(() => {
      fetchAccessToken();
    }, 500);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [address, accessToken]);

  return accessToken;
};

export default useAccessToken;

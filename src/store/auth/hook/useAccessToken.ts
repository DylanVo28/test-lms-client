import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { getAccessToken } from '..';
import { getCookie } from 'cookies-next';

const useAccessToken = () => {
  const { address } = useAccount();
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if (accessToken || !address) return;

    const fetchAccessToken = () => {
      const accessToken = getCookie('accessToken');
      setAccessToken(accessToken as string);
    };

    const timeoutId = setInterval(() => {
      fetchAccessToken();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [address, accessToken]);

  return accessToken;
};

export default useAccessToken;

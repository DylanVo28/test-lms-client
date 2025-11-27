import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';

type ThemeDetailResponse = any;

let cachedKey: string | null = null;
let cachedData: ThemeDetailResponse | null = null;

let inFlightKey: string | null = null;
let inFlightPromise: Promise<ThemeDetailResponse> | null = null;

const buildCacheKey = (userId?: string | null, token?: string | null) => {
  return `${userId || 'anonymous'}-${token || 'no-token'}`;
};

export const fetchThemeDetailCached = async (
  userId?: string | null,
  token?: string | null
): Promise<ThemeDetailResponse | null> => {
  if (!token) return null;

  const key = buildCacheKey(userId, token);

  if (cachedKey === key && cachedData) {
    return cachedData;
  }

  if (inFlightPromise && inFlightKey === key) {
    return inFlightPromise;
  }

  inFlightKey = key;
  inFlightPromise = privateRequest(request.get, API_PATH.THEME_DETAIL)
    .then((res) => {
      cachedKey = key;
      cachedData = res;
      return res;
    })
    .catch((error) => {
      if (inFlightKey === key) {
        inFlightPromise = null;
        inFlightKey = null;
      }
      throw error;
    })
    .finally(() => {
      if (inFlightKey === key) {
        inFlightPromise = null;
        inFlightKey = null;
      }
    });

  return inFlightPromise;
};

export const invalidateThemeDetailCache = () => {
  cachedKey = null;
  cachedData = null;
  inFlightKey = null;
  inFlightPromise = null;
};


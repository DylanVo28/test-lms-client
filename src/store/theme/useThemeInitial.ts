/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { themeAtom } from './theme';
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';

export const useThemeInitial = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const run = () => {
    const init = async () => {
      const res = await privateRequest(request.get, API_PATH.THEME_DETAIL);
      setTheme({
        ...res?.data,
      });
    };
    init();
  };

  return {
    theme,
    setTheme,
    requestGetTheme: run,
  };
};

/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { themeAtom } from './theme';
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import useNavigate from '@/hooks/useNavigate';

export const useThemeInitial = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const { params } = useNavigate();

  const run = () => {
    const init = async () => {
      let res;
      if (params?.code) {
        res = await privateRequest(
          request.get,
          API_PATH.THEMES + `/${params?.code}`
        );
        setTheme({
          ...res?.data,
          kolId: res?.data?.userId,
        });
      } else {
        res = await privateRequest(request.get, API_PATH.THEME_DETAIL);
        setTheme({
          ...res?.data,
        });
      }
    };
    init();
  };

  return {
    theme,
    setTheme,
    requestGetTheme: run,
  };
};

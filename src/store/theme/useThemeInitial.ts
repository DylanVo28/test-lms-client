/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { themeAtom } from './theme';
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { useRouter } from 'next/router';

export const useThemeInitial = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const router = useRouter();
  console.log('router', router);
  
  const run = () => {
    const init = async () => {
      let res;
      if (router.query?.code) {
        res = await privateRequest(
          request.get,
          API_PATH.THEMES + `/${router.query?.code}`
        );
        setTheme({
          ...res?.data,
          kolId: res?.data?.userId,
        });
      } else {
        // res = await privateRequest(request.get, API_PATH.THEME_DETAIL);
        // setTheme({
        //   ...res?.data,
        // });
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

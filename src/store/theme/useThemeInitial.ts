/* eslint-disable require-await */
/* eslint-disable unicorn/consistent-function-scoping */
import { useAtom } from 'jotai';

import { themeAtom } from './theme';
import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';

export const useThemeInitial = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const searchParams = useSearchParams();

  const codeKol = searchParams.get('code');

  console.log('codeKol', codeKol);

  const run = () => {
    const init = async () => {
      let res;
      if (codeKol) {
        res = await privateRequest(
          request.get,
          API_PATH.THEMES + `/${codeKol}`
        );
      } else {
        res = await privateRequest(request.get, API_PATH.THEME_DETAIL);
      }
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

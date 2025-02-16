/* eslint-disable require-await */
import { useAtom } from 'jotai';

import { themeAtom } from './theme';

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  return {
    setTheme,
    theme,
  };
};

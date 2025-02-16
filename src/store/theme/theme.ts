import { atom } from 'jotai';

export interface InitTheme {
  id: string;
  logo: string;
  color: string;
  langs: string[];
  code: string;
  colorMode: 'dark' | 'light';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export enum IColorMode {
  LIGHT_MODE = 'light',
  DARK_MODE = 'dark',
}

export const initialTheme: InitTheme = {
  id: '',
  logo: '',
  color: '',
  colorMode: 'dark',
  langs: [],
  code: '',
  userId: '',
  createdAt: '',
  updatedAt: '',
};

export const themeAtom = atom({
  ...initialTheme,
});

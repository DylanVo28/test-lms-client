import { atom } from 'jotai';

export interface InitTheme {
  id: string;
  logo: string;
  color: string;
  langs: string[];
  code: string;
  modeTheme: 'dark' | 'light';
  userId: string;
  kolId: string;
  createdAt: string;
  updatedAt: string;
}

export enum ImodeTheme {
  LIGHT_MODE = 'light',
  DARK_MODE = 'dark',
}

export const initialTheme: InitTheme = {
  id: '',
  logo: '',
  color: '',
  modeTheme: 'dark',
  langs: [],
  code: '',
  userId: '',
  kolId: '',
  createdAt: '',
  updatedAt: '',
};

export const themeAtom = atom({
  ...initialTheme,
});

import { atom } from 'jotai';
import { initialTheme } from './theme';

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
  title: string;
  banner: string;
  description: string;
  adminId: string;

  topics: string[];
}

export enum ImodeTheme {
  LIGHT_MODE = 'light',
  DARK_MODE = 'dark',
}

export const myThemeAtom = atom({
  ...initialTheme,
});

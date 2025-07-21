import { atom } from 'jotai';

export interface CustomColors {
  primary: string;
  background: string;
  card: string;
  secondary: string;
}

export interface InitTheme {
  id: string;
  logo: string;
  color: CustomColors;
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

export const DefaultThemeColor = {
  primary: '#02A6C2',
  background: '#FFFFFF',
  card: '#F8F9FA',
  secondary: '#6C757D',
};

export const initialTheme: InitTheme = {
  id: '',
  logo: '',
  color: DefaultThemeColor,

  title: '',
  topics: [],
  description: '',
  modeTheme: 'dark',
  langs: [],
  code: '',
  userId: '',
  kolId: '',
  banner: '',
  createdAt: '',
  updatedAt: '',
  adminId: '',
};

export const themeAtom = atom({
  ...initialTheme,
});

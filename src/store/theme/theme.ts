import { atom } from 'jotai';

export type CustomColors = {
  primary: string;
  background: string;
  card: string;
  secondary: string;
  text: string;
};

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
  background: '#000000',
  card: '#282828',
  secondary: '#F26F21',
  text: '#ffffff',
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

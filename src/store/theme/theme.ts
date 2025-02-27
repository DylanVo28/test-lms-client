import { atom } from 'jotai';

export interface InitTheme {
  id: string;
  logo: string;
  color: string;
  langs: string[];
  code: string;
  userId: string;
  kolId: string;
  createdAt: string;
  updatedAt: string;
}

export const initialTheme: InitTheme = {
  id: '',
  logo: '',
  color: '',
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

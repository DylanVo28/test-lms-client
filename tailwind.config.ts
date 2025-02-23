/* eslint-disable quotes */
/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/react';

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  theme: {
    extend: {
      fontFamily: {},
      colors: {
        white: 'var(--theme-white)',
        'white-10': 'var(--theme-white-10)',
        'white-5': 'var(--theme-white-5)',

        primary: 'var(--theme-primary)',
        'black-10': 'var(--theme-black-10)',
        'black-5': 'var(--theme-black-5)',
        'black-3': 'var(--theme-black-3)',
        'black-9': 'var(--theme-black-9)',
        'black-2': 'var(--theme-black-2)',
        'black-4': 'var(--theme-black-4)',

        'black-8': 'var(--theme-black-8)',
        'black-7': 'var(--theme-black-7)',
        'black-6': 'var(--theme-black-6)',
        orange: 'var(--theme-orange)',
        'orange-10': 'var(--theme-orange-10)',
        'orange-50': 'var(--theme-orange-50)',

        gray: 'var(--theme-gray)',
        'secondary-500': 'var(--theme-secondary-500)',

        main: 'var(--theme-main)',
        'main-60': 'var(--theme-main-60)',
        'main-20': 'var(--theme-main-20)',
        'main-10': 'var(--theme-main-10)',

        green: 'var(--theme-green)',
        'green-1': 'var(--theme-green-1)',

        'gray-10': 'var(--theme-gray-10)',
        'gray-20': 'var(--theme-gray-20)',
        'gray-30': 'var(--theme-gray-30)',

        error: 'var(--theme-error)',

        'error-1': 'var(--theme-error-1)',

        'noti-red': 'var(--theme-noti-red)',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};

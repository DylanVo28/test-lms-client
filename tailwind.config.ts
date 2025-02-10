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
        primary: '#0a0f15',
        'black-10': '#262626',
        'black-5': '#D9D9D9',
        'black-3': '#F5F5F5',
        'black-9': '#454545',
        'black-2': '#FCFCFC',
        'black-8': '#595959',
        'black-7': '#8C8C8C',
        'black-6': '#BFBFBF',
        orange: '#F26F21',
        gray: '#1F242A',
        main: 'var(--main-color)',
        'main-60': '#02A6C260',
        'main-20': '#02A6C220',
        'main-10': '#02A6C210',

        green: '#09A552',
        'green-1': '#1DB78D',

        'gray-10': '#F0F0F01A',
        'gray-20': '#F0F0F033',
        error: '#DF2638',
        'noti-red': '#E55151',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};

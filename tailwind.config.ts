/* eslint-disable quotes */
/** @type {impor'tailwindcss'.Config} */
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
      animation: {
        ping: 'ping 1s ease-out infinite',
        ping200: 'ping200 1s ease-out infinite',
        ping400: 'ping400 1s ease-out infinite',
      },
      keyframes: {
        ping: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.5' },
        },
        ping200: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.5' },
        },
        ping400: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.8)', opacity: '0.5' },
        },
      },
      colors: {
        white: 'var(--theme-white)',
        'white-10': 'var(--theme-white-10)',
        'white-15': 'var(--theme-white-15)',
        'white-50': 'var(--theme-white-50)',

        'white-5': 'var(--theme-white-5)',
        default: 'var(--theme-default)',

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
        'black-20': 'var(--theme-black-20)',
        'black-30': 'var(--theme-black-30)',
        'black-40': 'var(--theme-black-40)',
        'black-50': 'var(--theme-black-50)',
        'black-70': 'var(--theme-black-70)',

        'black-60': 'var(--theme-black-60)',
        'black-80': 'var(--theme-black-80)',

        'text-white': 'var(--theme-text-white)',

        orange: 'var(--theme-orange)',
        'orange-10': 'var(--theme-orange-10)',
        'orange-50': 'var(--theme-orange-50)',

        gray: 'var(--theme-gray)',
        'secondary-500': 'var(--theme-secondary-500)',
        secondary: 'var(--theme-main)',
        main: 'var(--theme-main)',
        'main-60': 'var(--theme-main-60)',
        'main-20': 'var(--theme-main-20)',
        'main-10': 'var(--theme-main-10)',

        green: 'var(--theme-green)',
        'green-10': 'var(--theme-green-10)',
        'green-50': 'var(--theme-green-50)',

        'green-1': 'var(--theme-green-1)',

        'gray-10': 'var(--theme-gray-10)',
        'gray-20': 'var(--theme-gray-20)',
        'gray-30': 'var(--theme-gray-30)',
        'gray-40': 'var(--theme-gray-40)',
        'gray-50': 'var(--theme-gray-50)',
        'gray-60': 'var(--theme-gray-60)',
        'gray-70': 'var(--theme-gray-70)',
        'gray-80': 'var(--theme-gray-80)',

        error: 'var(--theme-error)',

        'error-1': 'var(--theme-error-1)',
        'error-10': 'var(--theme-error-10)',

        'noti-red': 'var(--theme-noti-red)',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};

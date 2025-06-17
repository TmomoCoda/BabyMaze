import { join } from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [join(__dirname, 'app/**/*.{ts,tsx}'), join(__dirname, 'components/**/*.{ts,tsx}')],
  theme: {
    extend: {},
  },
  plugins: [],
};

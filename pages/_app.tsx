import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { useState, createContext } from 'react';

export const ThemeContext = createContext<'light' | 'dark'>('light');

export default function MyApp({ Component, pageProps }: AppProps) {
  const [theme] = useState<'light' | 'dark'>('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServiceWorker from '../components/ServiceWorker';

export const metadata: Metadata = {
  title: {
    default: 'FreeGames4Eva',
    template: '%s | Play Free | FreeGames4Eva'
  },
  description: 'Play thousands of community rated HTML5 games online.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#fafafa] text-gray-900">
        <Header />
        <main>{children}</main>
        <Footer />
        <ServiceWorker />
      </body>
    </html>
  );
}

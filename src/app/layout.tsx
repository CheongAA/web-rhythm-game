import Providers from '@/components/Providers';
import type { ReactNode } from 'react';
import { Press_Start_2P } from 'next/font/google';

import '@/styles/globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} pixel-art`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

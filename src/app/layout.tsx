import Providers from '@/components/Providers';
import type { ReactNode } from 'react';

import '@/styles/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="max-w-3xl mx-auto p-4">
        <Providers>
          <header className="py-3 flex items-center justify-between">
            <a href="/" className="font-semibold">
              App
            </a>
            <nav className="flex gap-3 text-sm">
              <a href="/">Home</a>
            </nav>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}

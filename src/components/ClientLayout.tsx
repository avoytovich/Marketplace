'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';
import { AuthProvider } from '../contexts/AuthContext';

function ClientLayoutContent({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex justify-center items-center py-6 px-4 bg-gradient-to-br from-blue-600 to-yellow-600">
          {children}
        </main>
        <footer className="text-center text-sm text-gray-700 p-4 border-t bg-gray-400">
          © {new Date().getFullYear()} BuySellHub. All rights reserved. Created
          by{' '}
          <Link
            href="https://portfolio-five-delta-66.vercel.app"
            target="_blank"
            className="text-blue-900 underline"
          >
            Andrii
          </Link>
        </footer>
      </body>
    </html>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </AuthProvider>
  );
}

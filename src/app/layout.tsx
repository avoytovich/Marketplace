import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Buy & Sell Platform',
  description: 'Connect buyers with sellers seamlessly.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 h-screen flex flex-col">
        <header className="p-4 bg-gray-800 text-white shadow">
          <nav className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="text-xl font-semibold">BuySellHub</div>
            <ul className="flex gap-4">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/buyer/request" className="hover:underline">
                  Post Request
                </Link>
              </li>
            </ul>
          </nav>
        </header>
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

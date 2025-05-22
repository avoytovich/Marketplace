import { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '../components/ClientLayout';

export const metadata: Metadata = {
  title: 'Buy & Sell Platform',
  description: 'Connect buyers with sellers seamlessly.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}

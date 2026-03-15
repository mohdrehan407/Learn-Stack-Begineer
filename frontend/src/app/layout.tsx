import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import AuthProvider from '../components/AuthProvider';
import FloatingAI from '../components/FloatingAI';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'LearnStack Platform',
  description: 'Professional Learning Management System with Premium UI',
  icons: {
    icon: '/favicon.svg',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <AuthProvider>
          {children}
          <FloatingAI />
        </AuthProvider>
      </body>
    </html>
  );
}

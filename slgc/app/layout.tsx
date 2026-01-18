import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SL Games Club',
  description: 'The ultimate community for Sri Lankan gamers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <AuthProvider>
          <Navbar />
          {/* Add padding so content isn't hidden behind fixed navbar */}
          <div className="pt-20">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
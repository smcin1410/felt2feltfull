import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import { ItineraryProvider } from './context/ItineraryContext';
import ItineraryButton from './components/ItineraryButton';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Felt2Felt',
  description: 'Your Poker Trip Planner',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Using Tailwind's arbitrary value syntax as a direct fix.
        This bypasses the theme configuration and applies the hex codes directly.
      */}
      <body className={`${inter.className} bg-[#111827] text-[#f3f4f6]`}>
        <ItineraryProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
          <ItineraryButton />
        </ItineraryProvider>
      </body>
    </html>
  );
}

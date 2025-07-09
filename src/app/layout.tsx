import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar'; // Corrected: Relative path
import { ItineraryProvider } from './context/ItineraryContext'; // Corrected: Relative path
import ItineraryButton from './components/ItineraryButton'; // Corrected: Relative path
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
      <body className={`${inter.className} bg-background-dark`}>
        <ItineraryProvider>
          <Navbar />
          <main className="pt-20"> {/* Add padding to main to offset fixed navbar */}
            {children}
          </main>
          <ItineraryButton />
        </ItineraryProvider>
      </body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar'; // Assuming you have a Navbar component
import { ItineraryProvider } from './context/ItineraryContext';
import ItineraryButton from './components/ItineraryButton'; // We will create this next

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
          <main>{children}</main>
          <ItineraryButton /> {/* Add the floating button here */}
        </ItineraryProvider>
      </body>
    </html>
  );
}
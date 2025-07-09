import type { Metadata } from 'next'
import './globals.css'
import { ItineraryProvider } from './context/ItineraryContext'
import Navbar from '@/components/Navbar'
import FloatingItinerary from '@/components/FloatingItinerary'

export const metadata: Metadata = {
  title: 'Felt2Felt',
  description: 'Your guide to the ultimate poker journey.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-[#0D0D0D] text-white min-h-screen">
        <ItineraryProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <FloatingItinerary />
        </ItineraryProvider>
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import FloatingItineraryIcon from '@/components/itinerary/FloatingItineraryIcon'
import Providers from '@/components/Providers'

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
        <Providers>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <FloatingItineraryIcon />
        </Providers>
      </body>
    </html>
  )
}
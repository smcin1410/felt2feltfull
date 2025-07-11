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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Poppins:wght@400;700;900&family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-roboto bg-[#121212] text-white min-h-screen">
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
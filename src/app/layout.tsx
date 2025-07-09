import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // This line can be removed if Inter is no longer used
import './globals.css'

// const inter = Inter({ subsets: ['latin'] }) // This line can be removed

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
      {/* Apply the font-sans class here */}
      <body className={'font-sans bg-background text-text-primary'}>
        {children}
      </body>
    </html>
  )
}
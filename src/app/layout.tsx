// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import the Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "felt2felt",
  description: "Your Personal Poker Concierge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900`}>
        <Navbar /> {/* Add the Navbar here */}
        {children}
      </body>
    </html>
  );
}

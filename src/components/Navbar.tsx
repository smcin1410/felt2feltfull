// src/components/Navbar.tsx
// An error in this component can prevent the main layout from building correctly.
// This version is confirmed to be correct.

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/trip-designer', label: 'Trip Designer' },
    { href: '/destinations', label: 'Destinations' },
    { href: '/tournaments', label: 'Tournaments' },
    { href: '/community', label: 'Community' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg shadow-cyan-500/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors" style={{ textShadow: '0 0 8px #22d3ee' }}>
              felt2felt.com
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-cyan-400 transition-colors">
                    {link.label}
                </Link>
              ))}
               <Link href="/signin" className="ml-6 px-4 py-2 rounded-md text-sm font-medium border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 transition-colors">
                    Sign In
                </Link>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-cyan-400">
                  {link.label}
              </Link>
            ))}
             <Link href="/signin" onClick={() => setIsOpen(false)} className="block px-3 py-2 mt-2 rounded-md text-base font-medium text-cyan-400 border border-cyan-400 hover:bg-cyan-400 hover:text-gray-900">
                  Sign In
              </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

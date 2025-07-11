'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// List of navigation links (centered, no Home)
const navLinks = [
  { name: 'Trip Designer', href: '/trip-designer' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Tournaments', href: '/tournaments' },
  { name: 'Community', href: '/community' },
  { name: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#121212] fixed top-0 left-0 right-0 z-30 border-b border-gray-800 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold neon-glow text-accent-neon tracking-wide select-none">
              felt2felt.com
            </Link>
          </div>

          {/* Center: Main Navigation Links */}
          <div className="flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-lg font-semibold neon-glow transition-all duration-150 ${
                      isActive
                        ? 'brightness-150 underline underline-offset-4'
                        : 'hover:brightness-200'
                    } text-accent-neon`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Sign In Button */}
          <div className="flex items-center">
            <Link href="/auth/signin" className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base shadow transition-all">
              {/* User/Profile Icon (SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
              </svg>
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

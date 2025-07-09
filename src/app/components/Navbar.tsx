'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// List of navigation links
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Tournaments', href: '/tournaments' },
  { name: 'Community', href: '/community' },
  { name: 'Blog', href: '/blog' },
  { name: 'Trip Designer', href: '/trip-designer' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-30 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-bold text-accent-light hover:text-accent-hotpink transition-colors">
            Felt2Felt
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-semibold transition-colors ${
                    isActive
                      ? 'text-accent-hotpink'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

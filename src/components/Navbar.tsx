'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useItineraryCount } from '@/store/itineraryStore';
import { FaBars, FaTimes, FaSuitcaseRolling } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = useItineraryCount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/destinations', label: 'Destinations' },
    { href: '/tournaments', label: 'Tournaments' },
    { href: '/community', label: 'Community' },
    { href: '/trip-designer', label: 'Trip Designer' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-orbitron font-bold neon-glow">
              Felt2Felt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-cyan-400 transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Itinerary Icon */}
          <div className="hidden md:flex items-center">
            <button className="relative p-2 text-white hover:text-pink-500 transition-colors duration-200">
              <FaSuitcaseRolling size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Itinerary Icon */}
            <button className="relative p-2 text-white hover:text-pink-500 transition-colors duration-200">
              <FaSuitcaseRolling size={18} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                  {itemCount}
                </span>
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="text-white hover:text-cyan-400 transition-colors duration-200"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800/95 backdrop-blur-sm rounded-lg mt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-white hover:text-cyan-400 hover:bg-gray-700/50 rounded-md transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

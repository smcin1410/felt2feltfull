'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useItineraryCount } from '@/store/itineraryStore';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { data: session } = useSession();
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
            <span className="text-2xl font-vegas font-bold neon-glow">
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

          {/* Profile Icon */}
          <div className="hidden md:flex items-center relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="relative p-2 text-white hover:text-pink-500 transition-colors duration-200"
            >
              <FaUser size={20} />
            </button>
            
            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                {session ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-gray-300">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Profile Icon */}
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="relative p-2 text-white hover:text-pink-500 transition-colors duration-200"
            >
              <FaUser size={18} />
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
              
              {/* Mobile Profile Menu */}
              {showProfileMenu && (
                <div className="px-2 pt-2 pb-3 border-t border-gray-700">
                  {session ? (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-3 py-2 text-white hover:text-cyan-400 hover:bg-gray-700/50 rounded-md transition-all duration-200"
                        onClick={() => {
                          setIsOpen(false);
                          setShowProfileMenu(false);
                        }}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setShowProfileMenu(false);
                          signOut();
                        }}
                        className="w-full text-left px-3 py-2 text-white hover:text-cyan-400 hover:bg-gray-700/50 rounded-md transition-all duration-200 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="block px-3 py-2 text-white hover:text-cyan-400 hover:bg-gray-700/50 rounded-md transition-all duration-200"
                      onClick={() => {
                        setIsOpen(false);
                        setShowProfileMenu(false);
                      }}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

'use client';
import Link from "next/link";
import { User, Search, Menu } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { id: "trip_designer", text: "Trip Designer", href: "/trip-designer" },
  { id: "destinations", text: "Destinations", href: "/destinations" },
  { id: "tournaments", text: "Tournaments", href: "/tournaments" },
  { id: "community", text: "Community", href: "/community" },
  { id: "blog", text: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-black bg-opacity-80 backdrop-blur-md border-b border-neutral-800 z-50 relative">
      <Link href="/homepage" className="text-2xl font-bold tracking-widest text-white neon-text">
        felt2felt.com
      </Link>
      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6">
        {navLinks.map((link) => (
          <Link key={link.id} href={link.href} className="text-lg text-white hover:text-pink-400 transition">
            {link.text}
          </Link>
        ))}
      </div>
      <div className="hidden md:flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-500 transition shadow">
          <User size={20} />
          <span>Sign In</span>
        </button>
        <button className="p-2 rounded-full bg-neutral-800 hover:bg-pink-600 transition">
          <Search size={20} className="text-white" />
        </button>
      </div>
      {/* Hamburger for mobile */}
      <button className="md:hidden p-2 rounded bg-neutral-800 text-white" onClick={() => setOpen((v) => !v)} aria-label="Open menu">
        <Menu size={28} />
      </button>
      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-black bg-opacity-95 flex flex-col items-center gap-4 py-6 md:hidden shadow-xl animate-fade-in z-50">
          {navLinks.map((link) => (
            <Link key={link.id} href={link.href} className="text-lg text-white hover:text-pink-400 transition" onClick={() => setOpen(false)}>
              {link.text}
            </Link>
          ))}
          <button className="flex items-center gap-2 px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-500 transition shadow">
            <User size={20} />
            <span>Sign In</span>
          </button>
          <button className="p-2 rounded-full bg-neutral-800 hover:bg-pink-600 transition">
            <Search size={20} className="text-white" />
          </button>
        </div>
      )}
    </nav>
  );
} 
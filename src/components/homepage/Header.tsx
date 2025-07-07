// Create this file at: src/components/homepage/Header.tsx
import React from 'react';

const Header = () => {
  return (
    <div className="text-center py-16 bg-gray-900">
        <div className="p-8 rounded-lg max-w-3xl mx-auto bg-gray-800 border border-gray-700">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-cyan-400" style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.7)' }}>
                Your Personal Poker Concierge
            </h1>
            <p className="mt-4 text-lg text-gray-300">
                Don't just find a random trip. Design the perfect one. Tell us what you're looking for, and we'll point you to the right felt.
            </p>
            <div className="mt-8">
                <a href="#" className="inline-block bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                    Find Your Action
                </a>
            </div>
        </div>
    </div>
  );
};
export default Header;
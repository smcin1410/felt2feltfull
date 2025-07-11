// src/components/FindNextFelt.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function FindNextFelt() {
  // Mock destination data for the three-card grid
  const destinations = [
    {
      id: 1,
      title: "Las Vegas",
      image: "/stock-photos/vegassign.jpeg",
      fallback: "/stock-photos/card.jpeg"
    },
    {
      id: 2,
      title: "Atlantic City",
      image: "/stock-photos/southfloridanight.jpeg",
      fallback: "/stock-photos/card.jpeg"
    },
    {
      id: 3,
      title: "Monte Carlo",
      image: "/stock-photos/card.jpeg",
      fallback: "/stock-photos/card.jpeg"
    }
  ];

  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});

  const handleImageError = (destinationId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [destinationId]: true
    }));
  };

  return (
    <section>
      <h2 className="destinations-title neon-glow text-3xl md:text-4xl font-bold text-center mb-8">
        Find Your Next Felt
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {destinations.map((destination) => (
          <div key={destination.id} className="relative rounded-xl overflow-hidden group h-56 flex items-end shadow-lg">
            {/* Background Image */}
            <Image
              src={imageErrors[destination.id] ? destination.fallback : destination.image}
              alt={`${destination.title} Background`}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300 z-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => handleImageError(destination.id)}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 z-10" />
            {/* Title Overlay */}
            <div className="relative z-20 w-full p-4 flex items-end justify-center">
              <h3 className="neon-glow text-xl font-bold text-center text-white drop-shadow-md">
                {destination.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
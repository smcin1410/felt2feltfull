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
      <h2 className="destinations-title">
        Find Your Next Felt
      </h2>
      <div className="destinations-grid-container">
        {destinations.map((destination) => (
          <div key={destination.id} className="destination-card">
            {/* Background Image */}
            <div className="destination-image">
              <Image
                src={imageErrors[destination.id] ? destination.fallback : destination.image}
                alt={`${destination.title} Background`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => handleImageError(destination.id)}
              />
            </div>
            
            {/* Overlay */}
            <div className="destination-overlay"></div>
            
            {/* Title Overlay */}
            <div className="destination-title-overlay">
              <h3 className="destination-name">
                {destination.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
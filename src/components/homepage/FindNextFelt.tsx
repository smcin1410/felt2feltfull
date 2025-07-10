// src/components/FindNextFelt.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react'; // Import useState

export default function FindNextFelt() {
  const originalSrc = "/stock-photos/vegassign.jpeg";
  const fallbackSrc = "/stock-photos/card.jpeg"; // Use an existing fallback image

  const [imageSrc, setImageSrc] = useState(originalSrc);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      console.error(`Error loading Find Next Felt image: ${originalSrc}. Attempting fallback...`);
      setImageSrc(fallbackSrc);
      setHasError(true);
    } else {
      console.error(`Fallback image also failed for Find Next Felt: ${fallbackSrc}.`);
    }
  };

  return (
    <section className="relative w-full h-64 overflow-hidden bg-gray-900 text-white flex flex-col justify-center items-center p-4 rounded-lg shadow-lg mt-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 h-full">
        <Image
          src={imageSrc} // Use state variable
          alt="Find Your Next Felt Background"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
          onError={handleImageError}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h2 className="text-3xl font-bold mb-2 font-orbitron neon-glow">Find Your Next Felt!</h2>
        <p className="text-lg mb-4">
          Let&apos;s find the perfect game for you.
        </p>
        <button className="btn-secondary">
          Start Your Search
        </button>
      </div>
    </section>
  );
}
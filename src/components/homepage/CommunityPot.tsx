// src/components/CommunityPot.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react'; // Import useState

export default function CommunityPot() {
  const originalSrc = "/stock-photos/southfloridanight.jpeg";
  const fallbackSrc = "/stock-photos/card.jpeg"; // Use an existing fallback image

  // State to manage the current image source
  const [imageSrc, setImageSrc] = useState(originalSrc);
  // State to track if an error has occurred
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) { // Prevent infinite loop if fallback also fails
      console.error(`Error loading Community Pot image: ${originalSrc}. Attempting fallback...`);
      setImageSrc(fallbackSrc);
      setHasError(true); // Mark that an error occurred
    } else {
      console.error(`Fallback image also failed for Community Pot: ${fallbackSrc}.`);
      // Optionally, set to a completely blank image or hide the image
      // setImageSrc('/placeholder.png'); // A very basic, guaranteed to exist image
    }
  };

  return (
    <section className="relative w-full h-[340px] md:h-[420px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt="Community Pot Background"
        fill
        className="object-cover object-center z-0"
        sizes="100vw"
        onError={handleImageError}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10" />
      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <h2 className="neon-glow text-4xl md:text-5xl font-bold mb-4">THE COMMUNITY POT</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Share your stories, find travel partners, and get the real scoop from players on the felt.
        </p>
        <button className="neon-btn-pink text-lg px-8 py-3">
          Join The Conversation
        </button>
      </div>
    </section>
  );
}
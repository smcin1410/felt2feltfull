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
    <section className="relative w-full h-64 overflow-hidden bg-gray-900 text-white flex flex-col justify-center items-center p-4 rounded-lg shadow-lg">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 h-full">
        <Image
          src={imageSrc} // Use the state variable for src
          alt="Community Pot Background"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
          onError={handleImageError}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h2 className="text-3xl font-bold mb-2">THE COMMUNITY POT</h2>
        <p className="text-lg mb-4">
          Share your stories, find travel partners, and get the real scoop from players on the felt.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
          Join The Conversation
        </button>
      </div>
    </section>
  );
}
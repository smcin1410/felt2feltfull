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
    <section className="community-pot-section">
      {/* Background Image */}
      <div className="community-pot-bg">
        <Image
          src={imageSrc}
          alt="Community Pot Background"
          fill
          className="object-cover"
          sizes="100vw"
          onError={handleImageError}
        />
      </div>

      {/* Overlay */}
      <div className="community-pot-overlay"></div>

      {/* Content */}
      <div className="community-pot-content">
        <h2 className="community-pot-title">THE COMMUNITY POT</h2>
        <p className="community-pot-subtitle">
          Share your stories, find travel partners, and get the real scoop from players on the felt.
        </p>
        <button className="community-pot-btn">
          Join The Conversation
        </button>
      </div>
    </section>
  );
}
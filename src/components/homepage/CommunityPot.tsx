// Corrected Code for: src/components/homepage/CommunityPot.tsx
import React from 'react';
import Image from 'next/image';

const CommunityPot = () => {
    return (
        <section className="relative text-center py-20 rounded-lg overflow-hidden border border-gray-700">
            <Image
                src="/community-bg.jpg"
                alt="Community background"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-0 opacity-20"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x400/111827/7dd3fc?text=Community'; }}
            />
            <div className="relative z-10 bg-black bg-opacity-50 p-8 rounded-lg max-w-3xl mx-auto">
                <h2 className="text-5xl font-bold text-cyan-400" style={{ textShadow: '0 0 15px #22d3ee' }}>
                    THE COMMUNITY POT
                </h2>
                <p className="mt-4 text-lg text-gray-200">
                    Share your stories, find travel partners, and get the real scoop from players on the felt.
                </p>
                <div className="mt-8">
                    <a href="/community" className="inline-block bg-pink-600 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-700 transition-colors shadow-[0_0_15px_rgba(219,39,119,0.8)]">
                        Join The Conversation
                    </a>
                </div>
            </div>
        </section>
    );
};
export default CommunityPot;
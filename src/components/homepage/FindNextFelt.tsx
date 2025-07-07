// Corrected Code for: src/components/homepage/FindNextFelt.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const destinations = [
  { name: 'Las Vegas', image: '/images/las-vegas.jpg', slug: 'las-vegas' },
  { name: 'South Florida', image: '/images/south-florida.jpg', slug: 'south-florida' },
  { name: 'London', image: '/images/london.jpg', slug: 'london' },
];

const FindNextFelt = () => {
  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400" style={{ textShadow: '0 0 8px #22d3ee' }}>
        Find Your Next Felt
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {destinations.map((dest) => (
          <Link href={`/destinations/${dest.slug}`} key={dest.name}>
            <div className="relative h-80 rounded-lg overflow-hidden group cursor-pointer shadow-lg">
              <Image
                src={dest.image}
                alt={dest.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-110"
                onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400/1f2937/7dd3fc?text=${dest.name.replace(' ', '+')}`; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
                <h3 className="text-white text-3xl font-bold drop-shadow-lg">{dest.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
export default FindNextFelt;
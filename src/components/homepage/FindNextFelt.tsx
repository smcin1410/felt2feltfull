import Image from 'next/image';
import Link from 'next/link';

// Fetch data for destination cards
async function getLocations() {
  const res = await fetch('http://localhost:3000/api/destinations', {
    cache: 'no-store', 
  });
  if (!res.ok) {
    throw new Error('Failed to fetch locations');
  }
  return res.json();
}

export default async function FindNextFelt() {
  const { data: locations } = await getLocations();

  return (
    <div className="bg-gray-900 text-white py-12 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center mb-8">FIND YOUR NEXT FELT</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location: any) => (
          <Link href={`/destinations/${location._id}`} key={location._id}>
            <div className="group relative block w-full h-64 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={location.image}
                alt={location.city}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h3 className="text-2xl font-bold">{location.city}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
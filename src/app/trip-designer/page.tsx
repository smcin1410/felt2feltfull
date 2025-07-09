'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

// Define a minimal structure for a Destination to get the city
interface Destination {
  city: string;
  // include other properties if needed for later steps
}

export default function TripDesignerPage() {
  // State for the list of cities, the user's selection, and UI status
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for the trip summary (to be built out later)
  const [tripSummary, setTripSummary] = useState<any[]>([]);

  // Fetch destinations to populate the city dropdown
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/destinations');
        if (!response.ok) {
          // If the server response is not OK, throw an error
          throw new Error('Failed to fetch destination data.');
        }
        const data: Destination[] = await response.json();

        // Process the data to get a unique, sorted list of cities
        const uniqueCities = Array.from(new Set(data.map(dest => dest.city))).sort();
        setCities(uniqueCities);
        
      } catch (err) {
        // This catch block will handle network errors or the error thrown above
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while loading cities.');
        }
      } finally {
        // This runs regardless of success or failure
        setLoading(false);
      }
    };

    fetchCities();
  }, []); // The empty dependency array means this runs once on component mount

  return (
    <>
      <Head>
        <title>Interactive Trip Planner - Felt2Felt</title>
        <meta name="description" content="Design your perfect poker trip." />
      </Head>
      <main className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-4xl font-bold mb-4 text-center text-accent-light">INTERACTIVE TRIP PLANNER</h1>
        <p className="text-center text-gray-400 mb-12">Build your custom poker itinerary in a few easy steps.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: The Steps */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Select a Destination */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">
                <span className="bg-accent-hotpink text-black rounded-full px-3 py-1 mr-3">1</span>
                Select a Destination
              </h2>
              <label htmlFor="city-select" className="block mb-2 text-sm font-medium text-gray-300">
                Choose a city to begin your journey.
              </label>
              <select
                id="city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={loading || !!error} // Disable if loading or if an error occurred
                className="w-full bg-gray-700 text-white p-3 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-accent-hotpink disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <option>Loading cities...</option>}
                {error && <option>Could not load cities</option>}
                {!loading && !error && (
                  <>
                    <option value="">-- Select a City --</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </>
                )}
              </select>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>
            {/* Future steps will be added here */}
            <div className="bg-gray-800/50 p-6 rounded-lg shadow-inner text-gray-500">
                <h2 className="text-xl font-bold mb-2">2. Find Tournaments & Events (Coming Soon)</h2>
            </div>
          </div>

          {/* Right Column: Trip Summary */}
          <aside>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-accent-hotpink pb-2">Trip Summary</h2>
              <div className="text-center text-gray-400 mt-6">
                <p>Your trip summary will appear here once you add items to your itinerary.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

// Define the structure for a Destination from the API
interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
  image: string;
  pokerRooms: number;
  averageBuyIn: string;
  bestTime: string;
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
        const uniqueCities = Array.from(new Set(data.map(dest => dest.name))).sort();
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
      <main className="min-h-screen bg-[#0D0D0D]">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-5xl font-orbitron font-bold mb-4 text-center neon-glow">INTERACTIVE TRIP PLANNER</h1>
          <p className="text-center text-gray-300 mb-16 text-lg">Build your custom poker itinerary in a few easy steps</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: The Steps */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Select a Destination */}
              <div className="card-style p-8">
                <h2 className="text-3xl font-orbitron font-bold mb-6 flex items-center text-white">
                  <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">1</span>
                  Select a Destination
                </h2>
                <label htmlFor="city-select" className="block mb-4 text-lg font-medium text-gray-300">
                  Choose a city to begin your journey
                </label>
                
                {loading && (
                  <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                    <span className="text-gray-300">Loading cities...</span>
                  </div>
                )}
                
                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg mb-4">
                    <p className="text-red-400 font-semibold">{error}</p>
                  </div>
                )}
                
                {!loading && !error && (
                  <select
                    id="city-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="filter-btn w-full text-lg"
                  >
                    <option value="">-- Select a City --</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                )}
              </div>
              
              {/* Future steps */}
              <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700/30 opacity-60">
                <h2 className="text-2xl font-orbitron font-bold mb-4 flex items-center text-gray-400">
                  <span className="bg-gray-600 text-gray-400 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">2</span>
                  Find Tournaments & Events
                </h2>
                <p className="text-gray-400">Coming Soon</p>
              </div>
            </div>

            {/* Right Column: Trip Summary */}
            <aside>
              <div className="card-style p-8 sticky top-24">
                <h2 className="text-2xl font-orbitron font-bold mb-6 neon-glow-pink border-b-2 border-pink-500/30 pb-4">Trip Summary</h2>
                <div className="text-center text-gray-300 mt-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <p className="leading-relaxed">Your trip summary will appear here once you add items to your itinerary.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
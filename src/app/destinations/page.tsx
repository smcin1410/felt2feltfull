'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

// Define the structure of a Destination object
interface Destination {
  _id: string;
  venue: string;
  city: string;
  state: string;
  country: string;
}

export default function PokerDestinations() {
  // State variables for managing data, loading, and errors
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State variables for search and filter functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Fetch destinations from the API when the component mounts
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations');
        if (!response.ok) {
          throw new Error('Failed to fetch destinations');
        }
        const data = await response.json();
        setDestinations(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Filter destinations based on the current search and filter selections
  const filteredDestinations = destinations.filter(destination =>
    destination.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.country.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(destination =>
    selectedCountry ? destination.country === selectedCountry : true
  ).filter(destination =>
    selectedState ? destination.state === selectedState : true
  ).filter(destination =>
    selectedCity ? destination.city === selectedCity : true
  );

  // Get unique values for dropdown filters
  const countries = Array.from(new Set(destinations.map(d => d.country)));
  const states = Array.from(new Set(destinations.map(d => d.state)));
  const cities = Array.from(new Set(destinations.map(d => d.city)));

  // Display a loading message while data is being fetched
  if (loading) {
    return <div className="text-center text-accent-light">Loading destinations...</div>;
  }

  // Display an error message if the data fetch fails
  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <Head>
        <title>Poker Destinations - Felt2Felt</title>
        <meta name="description" content="Find the best poker destinations worldwide." />
      </Head>
      <main className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-4xl font-bold mb-8 text-center text-accent-light">Poker Destinations</h1>

        {/* Search and Filter Section */}
        <div className="mb-8 p-4 bg-gray-800 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by City, Venue, State or Country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400 p-2 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-accent-hotpink"
            />
            {/* Country Dropdown */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-accent-hotpink"
            >
              <option value="">All Countries</option>
              {countries.map(country => <option key={country} value={country}>{country}</option>)}
            </select>
            {/* State/Province Dropdown */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-accent-hotpink"
            >
              <option value="">All States/Provinces</option>
              {states.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
            {/* City Dropdown */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-accent-hotpink"
            >
              <option value="">All Cities</option>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map(destination => (
              <div key={destination._id} className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-accent-hotpink transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-accent-light mb-2">{destination.venue}</h2>
                <p className="text-gray-400">{`${destination.city}, ${destination.state}, ${destination.country}`}</p>
              </div>
            ))
          ) : (
            <p className="text-center md:col-span-2 lg:col-span-3 text-gray-400">No destinations match your criteria.</p>
          )}
        </div>
      </main>
    </>
  );
}
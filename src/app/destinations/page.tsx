'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

// Define the structure of a Destination object
interface PokerRoom {
  _id: string;
  name: string;
  description: string;
}

interface Tournament {
  _id: string;
  name: string;
  buyIn: number;
  date: string;
}

interface Destination {
  _id: string;
  city: string;
  country: string;
  description: string;
  image: string;
  pokerRooms: PokerRoom[];
  tournaments: Tournament[];
}

export default function PokerDestinations() {
  // State variables for managing data, loading, and errors
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State variables for search and filter functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
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
    destination.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.pokerRooms.some(room => room.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ).filter(destination =>
    selectedCountry ? destination.country === selectedCountry : true
  ).filter(destination =>
    selectedCity ? destination.city === selectedCity : true
  );

  // Get unique values for dropdown filters
  const countries = Array.from(new Set(destinations.map(d => d.country)));
  const cities = Array.from(new Set(destinations.map(d => d.city)));

  return (
    <>
      <Head>
        <title>Poker Destinations - Felt2Felt</title>
        <meta name="description" content="Find the best poker destinations worldwide." />
      </Head>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold mb-4 text-center font-orbitron neon-glow">Poker Destinations</h1>
          <p className="text-center text-text-secondary mb-12 text-lg">Discover the world's premier poker venues</p>

          {/* Search and Filter Section */}
          <div className="mb-12 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search by City, Country, or Poker Room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="filter-btn"
              >
                <option value="">All Countries</option>
                {countries.map(country => <option key={country} value={country}>{country}</option>)}
              </select>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="filter-btn"
              >
                <option value="">All Cities</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-neon mx-auto mb-6"></div>
              <p className="text-text-secondary text-xl">Loading destinations...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-md mx-auto">
                <p className="text-red-400 font-semibold text-lg">Error: {error}</p>
              </div>
            </div>
          )}

          {/* Destinations Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map(destination => (
                  <div key={destination._id} className="card-style">
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <img
                        src={destination.image}
                        alt={`${destination.city}, ${destination.country}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/stock-photos/card.jpeg';
                        }}
                      />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 font-orbitron neon-glow">{destination.city}</h2>
                    <p className="text-gray-300 text-lg mb-3">{destination.country}</p>
                    <p className="text-gray-400 mb-4">{destination.description}</p>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-cyan-400 mb-2">Poker Rooms ({destination.pokerRooms.length})</h3>
                      <div className="space-y-1">
                        {destination.pokerRooms.slice(0, 3).map(room => (
                          <p key={room._id} className="text-sm text-gray-300">• {room.name}</p>
                        ))}
                        {destination.pokerRooms.length > 3 && (
                          <p className="text-sm text-cyan-400">+ {destination.pokerRooms.length - 3} more</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-pink-400 mb-2">Tournaments ({destination.tournaments.length})</h3>
                      <div className="space-y-1">
                        {destination.tournaments.slice(0, 2).map(tournament => (
                          <p key={tournament._id} className="text-sm text-gray-300">• {tournament.name}</p>
                        ))}
                        {destination.tournaments.length > 2 && (
                          <p className="text-sm text-pink-400">+ {destination.tournaments.length - 2} more</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-text-secondary text-xl">No destinations match your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
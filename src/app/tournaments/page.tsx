'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FaSuitcaseRolling } from 'react-icons/fa'; // Using react-icons for the luggage icon

// Define the structure of a Tournament object
interface Tournament {
  _id: string;
  series: string;
  venue: string;
  location: string;
  startDate: string; // Assuming dates are strings in ISO format
  endDate: string;
}

export default function TournamentCalendar() {
  // State for the full list of tournaments and the filtered list
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);

  // State for loading, error, and search functionality
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch all tournaments from the API on component mount
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('/api/tournaments');
        if (!response.ok) {
          // Provide a more specific error message
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch tournaments');
        }
        const data: Tournament[] = await response.json();
        setTournaments(data);
        setFilteredTournaments(data); // Initially, the filtered list is the full list
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

    fetchTournaments();
  }, []);

  // 2. Filter tournaments whenever the search query changes
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = tournaments.filter(tournament =>
      tournament.series.toLowerCase().includes(lowercasedQuery) ||
      tournament.venue.toLowerCase().includes(lowercasedQuery) ||
      tournament.location.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredTournaments(filtered);
  }, [searchQuery, tournaments]);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <Head>
        <title>Tournament Calendar - Felt2Felt</title>
        <meta name="description" content="Search for upcoming poker tournaments." />
      </Head>
      <main className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-4xl font-bold mb-8 text-center text-accent-light">Tournament Calendar</h1>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by series, venue, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-gray-700 text-white placeholder-gray-400 p-3 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-accent-hotpink"
          />
          <button className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300">
            Filters
          </button>
        </div>

        {/* Conditional Rendering for Loading, Error, and Content */}
        {loading ? (
          <div className="text-center text-accent-light">Loading tournaments...</div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-900/20 p-4 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tournament List */}
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map(tournament => (
                <div key={tournament._id} className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-accent-hotpink/20 transition-shadow duration-300">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="bg-accent-hotpink text-black font-bold p-3 rounded-md flex flex-col items-center justify-center w-20">
                       <span className="text-sm">{formatDate(tournament.startDate).split(' ')[0]}</span>
                       <span className="text-2xl">{formatDate(tournament.startDate).split(' ')[1]}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-accent-light">{tournament.series}</h2>
                      <p className="text-gray-400">{tournament.venue}, {tournament.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                      View Details
                    </button>
                    <button className="bg-accent-hotpink hover:bg-pink-500 text-black font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors duration-300">
                      <FaSuitcaseRolling />
                      Add to Itinerary
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 bg-gray-800 p-6 rounded-md">
                No tournaments match your search.
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
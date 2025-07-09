'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FaSuitcaseRolling } from 'react-icons/fa';
import { useItinerary } from '../context/ItineraryContext'; // Import the itinerary hook

// Define the structure of a Tournament object
interface Tournament {
  _id: string;
  name: string;
  location: string;
  buyIn: number;
  date: string;
  endDate: string;
  description: string;
  image: string;
  prizePool: number;
  players: number;
  status: string;
}

export default function TournamentCalendar() {
  // Get the addItem function from our global Itinerary Context
  const { addItem } = useItinerary();

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
          throw new Error('Failed to fetch tournaments');
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
      tournament.name.toLowerCase().includes(lowercasedQuery) ||
      tournament.location.toLowerCase().includes(lowercasedQuery) ||
      tournament.description.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredTournaments(filtered);
  }, [searchQuery, tournaments]);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Return a 'Month Day' format, e.g., "Oct 26"
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <Head>
        <title>Tournament Calendar - Felt2Felt</title>
        <meta name="description" content="Search for upcoming poker tournaments." />
      </Head>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold mb-4 text-center font-orbitron neon-glow">Tournament Calendar</h1>
          <p className="text-center text-text-secondary mb-12 text-lg">Find your next big tournament</p>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <input
              type="text"
              placeholder="Search by tournament name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar flex-grow"
            />
            <button className="filter-btn">
              Filters
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-neon mx-auto mb-6"></div>
              <p className="text-text-secondary text-xl">Loading tournaments...</p>
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

          {/* Tournament List */}
          {!loading && !error && (
            <div className="space-y-6">
              {filteredTournaments.length > 0 ? (
                filteredTournaments.map(tournament => (
                  <div key={tournament._id} className="card-style flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6 text-center md:text-left">
                      <div className="bg-gradient-to-br from-cyan-400 to-pink-500 text-black font-bold p-4 rounded-xl flex flex-col items-center justify-center w-24 h-24 shadow-lg">
                         <span className="text-sm">{formatDate(tournament.date).split(' ')[0]}</span>
                         <span className="text-2xl">{formatDate(tournament.date).split(' ')[1]}</span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2 font-orbitron neon-glow">{tournament.name}</h2>
                        <p className="text-gray-300 text-lg mb-2">{tournament.location}</p>
                        <p className="text-gray-400 mb-2">{tournament.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-cyan-400">Buy-in: ${tournament.buyIn.toLocaleString()}</span>
                          <span className="text-pink-400">Prize Pool: ${tournament.prizePool.toLocaleString()}</span>
                          <span className="text-green-400">Players: {tournament.players}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                      <button className="btn-secondary">
                        View Details
                      </button>
                      <button
                        onClick={() => addItem({
                          _id: tournament._id,
                          name: tournament.name,
                          type: 'Tournament'
                        })}
                        className="btn-primary flex items-center gap-2"
                      >
                        <FaSuitcaseRolling />
                        Add to Itinerary
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12">
                    <p className="text-text-secondary text-xl">No tournaments match your search.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

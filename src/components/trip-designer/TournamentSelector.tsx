'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaPlus, FaCheck, FaTrophy, FaUsers } from 'react-icons/fa';
import { Tournament, Destination } from '@/lib/types';
import ImageWithFallback from '@/components/ImageWithFallback';

interface TournamentSelectorProps {
  onTournamentSelect: (tournament: Tournament) => void;
  selectedTournaments: Tournament[];
  selectedDestinations?: Destination[];
  className?: string;
}

export default function TournamentSelector({ 
  onTournamentSelect, 
  selectedTournaments,
  selectedDestinations = [],
  className = '' 
}: TournamentSelectorProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCircuit, setSelectedCircuit] = useState('');
  const [minBuyIn, setMinBuyIn] = useState(0);
  const [maxBuyIn, setMaxBuyIn] = useState(10000);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('/api/tournaments');
        if (!response.ok) {
          throw new Error('Failed to fetch tournaments');
        }
        const data: Tournament[] = await response.json();
        setTournaments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  // Filter tournaments based on selected destinations and other criteria
  const filteredTournaments = tournaments.filter(tournament => {
    // Search query filter
    const matchesSearch = searchQuery.toLowerCase() === '' ||
      tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Location filter
    const matchesLocation = selectedLocation === '' || tournament.location === selectedLocation;

    // Circuit filter
    const matchesCircuit = selectedCircuit === '' || tournament.majorCircuit === selectedCircuit;

    // Buy-in filter
    const matchesBuyIn = tournament.buyIn >= minBuyIn && tournament.buyIn <= maxBuyIn;

    // Destination filter (if destinations are selected, only show tournaments in those locations)
    const matchesDestination = selectedDestinations.length === 0 || 
      selectedDestinations.some(dest => 
        tournament.location.toLowerCase().includes(dest.city.toLowerCase()) ||
        tournament.city?.toLowerCase() === dest.city.toLowerCase()
      );

    // Only show upcoming tournaments
    const isUpcoming = tournament.status === 'Upcoming' || tournament.status === 'Active';

    return matchesSearch && matchesLocation && matchesCircuit && matchesBuyIn && matchesDestination && isUpcoming;
  });

  // Get unique locations and circuits for filters
  const locations = Array.from(new Set(tournaments.map(t => t.location))).sort();
  const circuits = Array.from(new Set(tournaments.map(t => t.majorCircuit).filter(Boolean))).sort();

  // Check if tournament is already selected
  const isTournamentSelected = (tournament: Tournament) => {
    return selectedTournaments.some(selected => selected._id === tournament._id);
  };

  // Handle tournament selection
  const handleTournamentClick = (tournament: Tournament) => {
    if (!isTournamentSelected(tournament)) {
      onTournamentSelect(tournament);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format buy-in for display
  const formatBuyIn = (buyIn: number) => {
    if (buyIn >= 1000) {
      return `$${(buyIn / 1000).toFixed(buyIn % 1000 === 0 ? 0 : 1)}K`;
    }
    return `$${buyIn}`;
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-gray-300">Loading tournaments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar w-full"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="filter-btn"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select
            value={selectedCircuit}
            onChange={(e) => setSelectedCircuit(e.target.value)}
            className="filter-btn"
          >
            <option value="">All Circuits</option>
            {circuits.map(circuit => (
              <option key={circuit} value={circuit}>{circuit}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Buy-in"
              value={minBuyIn}
              onChange={(e) => setMinBuyIn(Number(e.target.value))}
              className="filter-btn flex-1"
              min="0"
            />
            <input
              type="number"
              placeholder="Max Buy-in"
              value={maxBuyIn}
              onChange={(e) => setMaxBuyIn(Number(e.target.value))}
              className="filter-btn flex-1"
              min="0"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-cyan-500 text-black' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'list' 
                  ? 'bg-cyan-500 text-black' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              List
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? 's' : ''} found
          {selectedDestinations.length > 0 && (
            <span className="ml-2 text-cyan-400">
              (filtered by selected destinations)
            </span>
          )}
        </div>
      </div>

      {/* Tournaments Display */}
      {filteredTournaments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FaTrophy className="mx-auto text-4xl mb-4 opacity-50" />
          <p>No tournaments found matching your criteria.</p>
          {selectedDestinations.length > 0 && (
            <p className="text-sm mt-2">Try selecting different destinations or adjusting your filters.</p>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredTournaments.map(tournament => {
            const isSelected = isTournamentSelected(tournament);
            
            return (
              <div
                key={tournament._id}
                className={`
                  relative cursor-pointer transition-all duration-300 transform hover:scale-105
                  ${viewMode === 'grid' ? 'card-style p-0 overflow-hidden' : 'card-style p-4'}
                  ${isSelected 
                    ? 'ring-2 ring-green-500 bg-green-900/20' 
                    : 'hover:shadow-lg hover:shadow-cyan-500/20'
                  }
                `}
                onClick={() => handleTournamentClick(tournament)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10 bg-green-500 text-black rounded-full p-2">
                    <FaCheck className="text-sm" />
                  </div>
                )}

                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={tournament.image}
                        fallbackSrc="/images/tournaments/default.jpg"
                        alt={tournament.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        {tournament.majorCircuit && (
                          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                            {tournament.majorCircuit}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{tournament.name}</h3>
                        <p className="text-cyan-400 text-sm flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {tournament.location}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center text-gray-400">
                          <FaDollarSign className="mr-2 text-green-400" />
                          <span>{formatBuyIn(tournament.buyIn)}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <FaCalendarAlt className="mr-2 text-pink-400" />
                          <span>{formatDate(tournament.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <FaTrophy className="mr-2 text-yellow-400" />
                          <span>${tournament.prizePool.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <FaUsers className="mr-2 text-blue-400" />
                          <span>{tournament.players} players</span>
                        </div>
                      </div>
                      <button
                        className={`
                          w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                          ${isSelected 
                            ? 'bg-green-600 text-white cursor-default' 
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                          }
                        `}
                        disabled={isSelected}
                      >
                        {isSelected ? (
                          <>
                            <FaCheck />
                            Added to Trip
                          </>
                        ) : (
                          <>
                            <FaPlus />
                            Add to Trip
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  // List View
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <ImageWithFallback
                        src={tournament.image}
                        fallbackSrc="/images/tournaments/default.jpg"
                        alt={tournament.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-white truncate">{tournament.name}</h3>
                            {tournament.majorCircuit && (
                              <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold flex-shrink-0">
                                {tournament.majorCircuit}
                              </span>
                            )}
                          </div>
                          <p className="text-cyan-400 text-sm flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {tournament.location}
                          </p>
                        </div>
                        <button
                          className={`
                            px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ml-4
                            ${isSelected 
                              ? 'bg-green-600 text-white cursor-default' 
                              : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                            }
                          `}
                          disabled={isSelected}
                        >
                          {isSelected ? <FaCheck /> : <FaPlus />}
                          {isSelected ? 'Added' : 'Add'}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center">
                          <FaDollarSign className="mr-1 text-green-400" />
                          {formatBuyIn(tournament.buyIn)}
                        </span>
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1 text-pink-400" />
                          {formatDate(tournament.date)}
                        </span>
                        <span className="flex items-center">
                          <FaTrophy className="mr-1 text-yellow-400" />
                          ${tournament.prizePool.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <FaUsers className="mr-1 text-blue-400" />
                          {tournament.players}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
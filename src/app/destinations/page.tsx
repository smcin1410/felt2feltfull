'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Destination, DestinationFilters as FilterType } from '@/lib/types';
import DestinationCard from '@/components/destinations/DestinationCard';
import DestinationFilters from '@/components/destinations/DestinationFilters';

export default function PokerDestinations() {
  // State variables for managing data, loading, and errors
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters using the new filter type
  const [filters, setFilters] = useState<FilterType>({
    searchQuery: '',
    selectedCountry: '',
    selectedCity: '',
    selectedRegion: '',
    minPokerRooms: undefined,
    maxPokerRooms: undefined,
    hasUpcomingTournaments: undefined
  });

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

  // Enhanced filtering logic using the new filter system
  const filteredDestinations = destinations.filter(destination => {
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        destination.city.toLowerCase().includes(query) ||
        destination.country.toLowerCase().includes(query) ||
        destination.description.toLowerCase().includes(query) ||
        destination.pokerRooms.some(room => room.name.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Country filter
    if (filters.selectedCountry && destination.country !== filters.selectedCountry) {
      return false;
    }

    // City filter
    if (filters.selectedCity && destination.city !== filters.selectedCity) {
      return false;
    }

    // Region filter (if available)
    if (filters.selectedRegion && destination.region !== filters.selectedRegion) {
      return false;
    }

    // Poker rooms count filter
    if (filters.minPokerRooms && destination.pokerRooms.length < filters.minPokerRooms) {
      return false;
    }
    if (filters.maxPokerRooms && destination.pokerRooms.length > filters.maxPokerRooms) {
      return false;
    }

    // Tournament availability filter
    if (filters.hasUpcomingTournaments !== undefined) {
      const hasUpcoming = destination.tournaments.length > 0;
      if (filters.hasUpcomingTournaments !== hasUpcoming) {
        return false;
      }
    }

    return true;
  });

  // Get unique values for dropdown filters
  const countries = Array.from(new Set(destinations.map(d => d.country))).sort();
  const cities = Array.from(new Set(destinations.map(d => d.city))).sort();
  const regions = Array.from(new Set(destinations.map(d => d.region).filter(Boolean) as string[])).sort();

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Head>
        <title>Poker Destinations - Felt2Felt</title>
        <meta name="description" content="Find the best poker destinations worldwide." />
      </Head>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold mb-4 text-center font-orbitron neon-glow">Poker Destinations</h1>
          <p className="text-center text-text-secondary mb-12 text-lg">Discover the world&apos;s premier poker venues</p>

          {/* Enhanced Filter Section */}
          <DestinationFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            countries={countries}
            cities={cities}
            regions={regions}
          />

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

          {/* Results Summary */}
          {!loading && !error && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-300">
                Showing <span className="text-cyan-400 font-semibold">{filteredDestinations.length}</span> of{' '}
                <span className="text-cyan-400 font-semibold">{destinations.length}</span> destinations
              </p>
              {filteredDestinations.length !== destinations.length && (
                <button
                  onClick={() => handleFiltersChange({
                    searchQuery: '',
                    selectedCountry: '',
                    selectedCity: '',
                    selectedRegion: '',
                    minPokerRooms: undefined,
                    maxPokerRooms: undefined,
                    hasUpcomingTournaments: undefined
                  })}
                  className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Destinations Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map(destination => (
                  <DestinationCard
                    key={destination._id}
                    destination={destination}
                    showAddButton={true}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12">
                    <p className="text-text-secondary text-xl mb-4">No destinations match your criteria.</p>
                    <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
                    <button
                      onClick={() => handleFiltersChange({
                        searchQuery: '',
                        selectedCountry: '',
                        selectedCity: '',
                        selectedRegion: '',
                        minPokerRooms: undefined,
                        maxPokerRooms: undefined,
                        hasUpcomingTournaments: undefined
                      })}
                      className="btn-primary"
                    >
                      Clear All Filters
                    </button>
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
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Tournament, TournamentFilters as FilterType } from '@/lib/types';
import TournamentItem from '@/components/tournaments/TournamentItem';
import TournamentFilters from '@/components/tournaments/TournamentFilters';

export default function TournamentCalendar() {
  // State for the full list of tournaments
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters using the new filter type
  const [filters, setFilters] = useState<FilterType>({
    searchQuery: '',
    selectedLocation: '',
    selectedCircuit: '',
    minBuyIn: 0,
    maxBuyIn: 0,
    dateRange: { start: '', end: '' },
    status: '',
    selectedTags: []
  });

  // Fetch all tournaments from the API on component mount
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

  // Enhanced filtering logic using the new filter system
  const filteredTournaments = tournaments.filter(tournament => {
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        tournament.name.toLowerCase().includes(query) ||
        tournament.location.toLowerCase().includes(query) ||
        tournament.description.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Location filter
    if (filters.selectedLocation && tournament.location !== filters.selectedLocation) {
      return false;
    }

    // Circuit filter
    if (filters.selectedCircuit && tournament.majorCircuit !== filters.selectedCircuit) {
      return false;
    }

    // Buy-in range filter
    if (filters.minBuyIn > 0 && tournament.buyIn < filters.minBuyIn) {
      return false;
    }
    if (filters.maxBuyIn > 0 && tournament.buyIn > filters.maxBuyIn) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start) {
      const tournamentDate = new Date(tournament.date);
      const startDate = new Date(filters.dateRange.start);
      if (tournamentDate < startDate) return false;
    }
    if (filters.dateRange.end) {
      const tournamentDate = new Date(tournament.date);
      const endDate = new Date(filters.dateRange.end);
      if (tournamentDate > endDate) return false;
    }

    // Status filter
    if (filters.status && tournament.status !== filters.status) {
      return false;
    }

    // Tags filter
    if (filters.selectedTags.length > 0) {
      const tournamentTags = tournament.tags || [];
      const hasMatchingTag = filters.selectedTags.some(tag =>
        tournamentTags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  // Get unique values for dropdown filters
  const locations = Array.from(new Set(tournaments.map(t => t.location))).sort();
  const circuits = Array.from(new Set(tournaments.map(t => t.majorCircuit).filter(Boolean) as string[])).sort();
  const allTags = Array.from(new Set(tournaments.flatMap(t => t.tags || []))).sort();

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };


  return (
    <>
      <Head>
        <title>Tournament Calendar - Felt2Felt</title>
        <meta name="description" content="Search for upcoming poker tournaments." />
      </Head>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center font-vegas neon-glow">Tournament Calendar</h1>
          <p className="text-center text-text-secondary mb-8 md:mb-12 text-base md:text-lg">Find your next big tournament</p>

          {/* Enhanced Filter Section */}
          <TournamentFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            locations={locations}
            circuits={circuits}
            tags={allTags}
          />

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

          {/* Results Summary */}
          {!loading && !error && (
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <p className="text-gray-300 text-sm md:text-base">
                Showing <span className="text-cyan-400 font-semibold">{filteredTournaments.length}</span> of{' '}
                <span className="text-cyan-400 font-semibold">{tournaments.length}</span> tournaments
              </p>
              {filteredTournaments.length !== tournaments.length && (
                <button
                  onClick={() => handleFiltersChange({
                    searchQuery: '',
                    selectedLocation: '',
                    selectedCircuit: '',
                    minBuyIn: 0,
                    maxBuyIn: 0,
                    dateRange: { start: '', end: '' },
                    status: '',
                    selectedTags: []
                  })}
                  className="text-cyan-400 hover:text-cyan-300 text-sm underline self-start md:self-auto"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Tournament List */}
          {!loading && !error && (
            <div className="space-y-4 md:space-y-6">
              {filteredTournaments.length > 0 ? (
                filteredTournaments.map(tournament => (
                  <TournamentItem
                    key={tournament._id}
                    tournament={tournament}
                    layout="list"
                    showAddButton={true}
                  />
                ))
              ) : tournaments.length === 0 ? (
                <div className="text-center py-12 md:py-20">
                  <div className="max-w-lg mx-auto">
                    <div className="bg-gradient-to-r from-pink-500/20 to-cyan-400/20 rounded-xl p-6 md:p-12 border border-pink-500/30">
                      <h3 className="font-vegas text-2xl md:text-3xl text-pink-400 mb-4">🎰 High Roller Events Loading...</h3>
                      <p className="text-gray-300 text-base md:text-lg mb-4">
                        We're partnering with the biggest casinos in Vegas to bring you exclusive tournament access.
                      </p>
                      <p className="text-cyan-400 font-semibold text-sm md:text-base mb-4">
                        WSOP • WPT • Aria High Roller • Bellagio Cup
                      </p>
                      <div className="bg-black/30 rounded-lg p-4 border border-cyan-400/30">
                        <p className="text-cyan-400 text-sm">
                          💎 VIP tournament packages coming soon
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 md:py-20">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 md:p-12 max-w-md mx-auto">
                    <p className="text-text-secondary text-lg md:text-xl mb-4">No tournaments match your criteria.</p>
                    <p className="text-gray-400 mb-6 text-sm md:text-base">Try adjusting your filters or search terms.</p>
                    <button
                      onClick={() => handleFiltersChange({
                        searchQuery: '',
                        selectedLocation: '',
                        selectedCircuit: '',
                        minBuyIn: 0,
                        maxBuyIn: 0,
                        dateRange: { start: '', end: '' },
                        status: '',
                        selectedTags: []
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

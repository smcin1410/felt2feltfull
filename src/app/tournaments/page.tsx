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
      <main className="tournaments-page">
        <div className="tournaments-page-container">
          <div className="tournaments-header">
            <h1 className="tournaments-page-title neon-glow text-4xl md:text-5xl font-bold text-center mb-4">Tournament Calendar</h1>
            <p className="tournaments-page-subtitle text-gray-300 mb-6">Find your next big tournament</p>
          </div>

          {/* Enhanced Filter Section */}
          <div className="tournaments-filters-section frosted-glass neon-card mb-8">
            <TournamentFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              locations={locations}
              circuits={circuits}
              tags={allTags}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="tournaments-loading text-center p-8">
              <div className="tournaments-loading-spinner animate-spin rounded-full h-12 w-12 border-b-2 border-accent-neon mx-auto mb-4"></div>
              <p className="tournaments-loading-text text-gray-300">Loading tournaments...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="tournaments-error text-center p-8">
              <div className="tournaments-error-card frosted-glass neon-card border border-accent-hotpink">
                <p className="tournaments-error-text text-accent-hotpink font-semibold">Error: {error}</p>
              </div>
            </div>
          )}

          {/* Results Summary */}
          {!loading && !error && (
            <div className="tournaments-results-summary">
              <p className="tournaments-results-count">
                Showing <span className="tournaments-count-highlight">{filteredTournaments.length}</span> of{' '}
                <span className="tournaments-count-highlight">{tournaments.length}</span> tournaments
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
                  className="tournaments-clear-filters"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Tournament List */}
          {!loading && !error && (
            <div className="tournaments-list">
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
                <div className="tournaments-empty-state">
                  <div className="tournaments-empty-card">
                    <h3 className="tournaments-empty-title">🎰 High Roller Events Loading...</h3>
                    <p className="tournaments-empty-text">
                      We're partnering with the biggest casinos in Vegas to bring you exclusive tournament access.
                    </p>
                    <p className="tournaments-empty-circuits">
                      WSOP • WPT • Aria High Roller • Bellagio Cup
                    </p>
                    <div className="tournaments-empty-note">
                      <p className="tournaments-empty-note-text">💎 VIP tournament packages coming soon</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="tournaments-no-results">
                  <div className="tournaments-no-results-card">
                    <p className="tournaments-no-results-title">No tournaments match your criteria.</p>
                    <p className="tournaments-no-results-text">Try adjusting your filters or search terms.</p>
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
                      className="tournaments-clear-all-btn"
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

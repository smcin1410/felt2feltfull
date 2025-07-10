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
      <main className="destinations-page">
        <div className="destinations-page-container">
          <div className="destinations-header">
            <h1 className="destinations-page-title">Poker Destinations</h1>
            <p className="destinations-page-subtitle">Discover the world&apos;s premier poker venues</p>
          </div>

          {/* Enhanced Filter Section */}
          <div className="destinations-filters-section">
            <DestinationFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              countries={countries}
              cities={cities}
              regions={regions}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="destinations-loading">
              <div className="destinations-loading-spinner"></div>
              <p className="destinations-loading-text">Loading destinations...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="destinations-error">
              <div className="destinations-error-card">
                <p className="destinations-error-text">Error: {error}</p>
              </div>
            </div>
          )}

          {/* Results Summary */}
          {!loading && !error && (
            <div className="destinations-results-summary">
              <p className="destinations-results-count">
                Showing <span className="destinations-count-highlight">{filteredDestinations.length}</span> of{' '}
                <span className="destinations-count-highlight">{destinations.length}</span> destinations
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
                  className="destinations-clear-filters"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Destinations Grid */}
          {!loading && !error && (
            <div className="destinations-grid">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map(destination => (
                  <DestinationCard
                    key={destination._id}
                    destination={destination}
                    showAddButton={true}
                  />
                ))
              ) : destinations.length === 0 ? (
                <div className="destinations-empty-state">
                  <div className="destinations-empty-card">
                    <h3 className="destinations-empty-title">🎰 Legendary Venues Coming Soon!</h3>
                    <p className="destinations-empty-text">
                      We're curating the most iconic poker destinations from around the globe.
                    </p>
                    <div className="destinations-empty-features">
                      <p className="destinations-empty-feature">🌟 Las Vegas Strip Casinos</p>
                      <p className="destinations-empty-feature">🎯 Monte Carlo & European Classics</p>
                      <p className="destinations-empty-feature">🏝️ Caribbean & Cruise Ship Poker</p>
                    </div>
                    <div className="destinations-empty-note">
                      <p className="destinations-empty-note-text">💎 Exclusive venue partnerships in development</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="destinations-no-results">
                  <div className="destinations-no-results-card">
                    <p className="destinations-no-results-title">No destinations match your criteria.</p>
                    <p className="destinations-no-results-text">Try adjusting your filters or search terms.</p>
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
                      className="destinations-clear-all-btn"
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
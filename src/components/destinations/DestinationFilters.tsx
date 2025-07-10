'use client';

import { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { DestinationFilters as FilterType } from '@/lib/types';

interface DestinationFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  countries: string[];
  cities: string[];
  regions?: string[];
}

export default function DestinationFilters({
  filters,
  onFiltersChange,
  countries,
  cities,
  regions = []
}: DestinationFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof FilterType, value: string | number | boolean | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      selectedCountry: '',
      selectedCity: '',
      selectedRegion: '',
      minPokerRooms: undefined,
      maxPokerRooms: undefined,
      hasUpcomingTournaments: undefined
    });
    setShowAdvanced(false);
  };

  const hasActiveFilters = filters.selectedCountry || 
                          filters.selectedCity || 
                          filters.selectedRegion ||
                          filters.minPokerRooms ||
                          filters.maxPokerRooms ||
                          filters.hasUpcomingTournaments;

  return (
    <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search destinations by city, country, or poker room..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="search-bar pl-12 w-full"
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`filter-btn flex items-center gap-2 ${
              showAdvanced ? 'bg-cyan-400/20 border-cyan-400/50' : ''
            }`}
          >
            <FaFilter />
            Advanced Filters
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-secondary flex items-center gap-2"
            >
              <FaTimes />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          value={filters.selectedCountry}
          onChange={(e) => handleFilterChange('selectedCountry', e.target.value)}
          className="filter-btn"
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <select
          value={filters.selectedCity}
          onChange={(e) => handleFilterChange('selectedCity', e.target.value)}
          className="filter-btn"
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {regions.length > 0 && (
          <select
            value={filters.selectedRegion || ''}
            onChange={(e) => handleFilterChange('selectedRegion', e.target.value)}
            className="filter-btn"
          >
            <option value="">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-700/50 pt-4 space-y-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Advanced Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Poker Rooms Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Number of Poker Rooms
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPokerRooms || ''}
                  onChange={(e) => handleFilterChange('minPokerRooms', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="search-bar flex-1"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPokerRooms || ''}
                  onChange={(e) => handleFilterChange('maxPokerRooms', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="search-bar flex-1"
                  min="0"
                />
              </div>
            </div>

            {/* Tournament Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Tournament Availability
              </label>
              <select
                value={filters.hasUpcomingTournaments === undefined ? '' : filters.hasUpcomingTournaments.toString()}
                onChange={(e) => handleFilterChange('hasUpcomingTournaments', 
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )}
                className="filter-btn w-full"
              >
                <option value="">All Destinations</option>
                <option value="true">Has Upcoming Tournaments</option>
                <option value="false">No Upcoming Tournaments</option>
              </select>
            </div>

            {/* Additional filter space for future features */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                More Filters
              </label>
              <div className="text-sm text-gray-400 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                Additional filters coming soon...
              </div>
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.selectedCountry && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">
                    Country: {filters.selectedCountry}
                    <button
                      onClick={() => handleFilterChange('selectedCountry', '')}
                      className="hover:text-cyan-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
                {filters.selectedCity && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-400/20 text-pink-400 rounded-full text-sm">
                    City: {filters.selectedCity}
                    <button
                      onClick={() => handleFilterChange('selectedCity', '')}
                      className="hover:text-pink-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
                {filters.selectedRegion && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm">
                    Region: {filters.selectedRegion}
                    <button
                      onClick={() => handleFilterChange('selectedRegion', '')}
                      className="hover:text-green-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
                {(filters.minPokerRooms || filters.maxPokerRooms) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm">
                    Rooms: {filters.minPokerRooms || 0}-{filters.maxPokerRooms || '∞'}
                    <button
                      onClick={() => {
                        handleFilterChange('minPokerRooms', undefined);
                        handleFilterChange('maxPokerRooms', undefined);
                      }}
                      className="hover:text-yellow-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
                {filters.hasUpcomingTournaments !== undefined && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-400/20 text-purple-400 rounded-full text-sm">
                    {filters.hasUpcomingTournaments ? 'Has Tournaments' : 'No Tournaments'}
                    <button
                      onClick={() => handleFilterChange('hasUpcomingTournaments', undefined)}
                      className="hover:text-purple-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
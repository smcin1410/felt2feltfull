'use client';

import { useState } from 'react';
import { FaSearch, FaFilter, FaTimes, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { TournamentFilters as FilterType } from '@/lib/types';

interface TournamentFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  locations: string[];
  circuits: string[];
  tags: string[];
}

export default function TournamentFilters({
  filters,
  onFiltersChange,
  locations,
  circuits,
  tags
}: TournamentFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof FilterType, value: string | number | { start: string; end: string } | string[]) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      selectedLocation: '',
      selectedCircuit: '',
      minBuyIn: 0,
      maxBuyIn: 0,
      dateRange: { start: '', end: '' },
      status: '',
      selectedTags: []
    });
    setShowAdvanced(false);
  };

  const hasActiveFilters = filters.selectedLocation || 
                          filters.selectedCircuit || 
                          filters.minBuyIn > 0 ||
                          filters.maxBuyIn > 0 ||
                          filters.dateRange.start ||
                          filters.dateRange.end ||
                          filters.status ||
                          filters.selectedTags.length > 0;

  const handleTagToggle = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    handleFilterChange('selectedTags', newTags);
  };

  return (
    <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tournaments by name, location, or description..."
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <select
          value={filters.selectedLocation}
          onChange={(e) => handleFilterChange('selectedLocation', e.target.value)}
          className="filter-btn"
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select
          value={filters.selectedCircuit}
          onChange={(e) => handleFilterChange('selectedCircuit', e.target.value)}
          className="filter-btn"
        >
          <option value="">All Circuits</option>
          {circuits.map(circuit => (
            <option key={circuit} value={circuit}>{circuit}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="filter-btn"
        >
          <option value="">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>

        <div className="relative">
          <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            placeholder="Max Buy-in"
            value={filters.maxBuyIn || ''}
            onChange={(e) => handleFilterChange('maxBuyIn', e.target.value ? parseInt(e.target.value) : 0)}
            className="search-bar pl-12 w-full"
            min="0"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-700/50 pt-4 space-y-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Advanced Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Buy-in Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Buy-in Range
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minBuyIn || ''}
                    onChange={(e) => handleFilterChange('minBuyIn', e.target.value ? parseInt(e.target.value) : 0)}
                    className="search-bar pl-8 w-full"
                    min="0"
                  />
                </div>
                <div className="relative flex-1">
                  <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxBuyIn || ''}
                    onChange={(e) => handleFilterChange('maxBuyIn', e.target.value ? parseInt(e.target.value) : 0)}
                    className="search-bar pl-8 w-full"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Date Range
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                    className="search-bar pl-8 w-full"
                  />
                </div>
                <div className="relative flex-1">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                    className="search-bar pl-8 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Tournament Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Tournament Types
              </label>
              <div className="max-h-32 overflow-y-auto space-y-2 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                {tags.slice(0, 8).map(tag => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      className="rounded border-gray-600 bg-gray-700 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-300">{tag}</span>
                  </label>
                ))}
                {tags.length > 8 && (
                  <p className="text-xs text-gray-400 pt-2 border-t border-gray-600/30">
                    +{tags.length - 8} more tags available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.selectedLocation && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">
                    Location: {filters.selectedLocation}
                    <button
                      onClick={() => handleFilterChange('selectedLocation', '')}
                      className="hover:text-cyan-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
                {filters.selectedCircuit && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-400/20 text-pink-400 rounded-full text-sm">
                    Circuit: {filters.selectedCircuit}
                    <button
                      onClick={() => handleFilterChange('selectedCircuit', '')}
                      className="hover:text-pink-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
                {filters.status && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm">
                    Status: {filters.status}
                    <button
                      onClick={() => handleFilterChange('status', '')}
                      className="hover:text-green-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
                {(filters.minBuyIn > 0 || filters.maxBuyIn > 0) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm">
                    Buy-in: ${filters.minBuyIn || 0} - ${filters.maxBuyIn || '∞'}
                    <button
                      onClick={() => {
                        handleFilterChange('minBuyIn', 0);
                        handleFilterChange('maxBuyIn', 0);
                      }}
                      className="hover:text-yellow-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
                {(filters.dateRange.start || filters.dateRange.end) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-400/20 text-purple-400 rounded-full text-sm">
                    Dates: {filters.dateRange.start || 'Any'} - {filters.dateRange.end || 'Any'}
                    <button
                      onClick={() => handleFilterChange('dateRange', { start: '', end: '' })}
                      className="hover:text-purple-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
                {filters.selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-400/20 text-indigo-400 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="hover:text-indigo-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
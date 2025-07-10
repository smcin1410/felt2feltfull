'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaGamepad, FaDollarSign, FaCalendarAlt, FaPlus, FaCheck } from 'react-icons/fa';
import { Destination } from '@/lib/types';
import ImageWithFallback from '@/components/ImageWithFallback';

interface DestinationSelectorProps {
  onDestinationSelect: (destination: Destination) => void;
  selectedDestinations: Destination[];
  className?: string;
}

export default function DestinationSelector({ 
  onDestinationSelect, 
  selectedDestinations, 
  className = '' 
}: DestinationSelectorProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations');
        if (!response.ok) {
          throw new Error('Failed to fetch destinations');
        }
        const data: Destination[] = await response.json();
        setDestinations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Filter destinations
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = searchQuery.toLowerCase() === '' ||
      destination.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry = selectedCountry === '' || destination.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  // Get unique countries for filter
  const countries = Array.from(new Set(destinations.map(dest => dest.country))).sort();

  // Check if destination is already selected
  const isDestinationSelected = (destination: Destination) => {
    return selectedDestinations.some(selected => selected._id === destination._id);
  };

  // Handle destination selection
  const handleDestinationClick = (destination: Destination) => {
    if (!isDestinationSelected(destination)) {
      onDestinationSelect(destination);
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-gray-300">Loading destinations...</span>
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
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar w-full"
            />
          </div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="filter-btn sm:w-48"
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
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
          <div className="text-sm text-gray-400">
            {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Destinations Display */}
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FaMapMarkerAlt className="mx-auto text-4xl mb-4 opacity-50" />
          <p>No destinations found matching your criteria.</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredDestinations.map(destination => {
            const isSelected = isDestinationSelected(destination);
            
            return (
              <div
                key={destination._id}
                className={`
                  relative cursor-pointer transition-all duration-300 transform hover:scale-105
                  ${viewMode === 'grid' ? 'card-style p-0 overflow-hidden' : 'card-style p-4'}
                  ${isSelected 
                    ? 'ring-2 ring-green-500 bg-green-900/20' 
                    : 'hover:shadow-lg hover:shadow-cyan-500/20'
                  }
                `}
                onClick={() => handleDestinationClick(destination)}
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
                        src={destination.image}
                        fallbackSrc="/images/destinations/default.jpg"
                        alt={destination.city}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{destination.city}</h3>
                        <p className="text-cyan-400 text-sm flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {destination.country}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{destination.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-400">
                          <FaGamepad className="mr-2 text-cyan-400" />
                          <span>{destination.pokerRooms.length} rooms</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <FaDollarSign className="mr-2 text-green-400" />
                          <span>{destination.averageBuyIn || 'Varies'}</span>
                        </div>
                        <div className="flex items-center text-gray-400 col-span-2">
                          <FaCalendarAlt className="mr-2 text-pink-400" />
                          <span>Best: {destination.bestTimeToVisit || 'Year-round'}</span>
                        </div>
                      </div>
                      <button
                        className={`
                          w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
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
                        src={destination.image}
                        fallbackSrc="/images/destinations/default.jpg"
                        alt={destination.city}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white">{destination.city}</h3>
                          <p className="text-cyan-400 text-sm flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {destination.country}
                          </p>
                        </div>
                        <button
                          className={`
                            px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1
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
                      <p className="text-gray-300 text-sm mb-2 line-clamp-1">{destination.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center">
                          <FaGamepad className="mr-1 text-cyan-400" />
                          {destination.pokerRooms.length} rooms
                        </span>
                        <span className="flex items-center">
                          <FaDollarSign className="mr-1 text-green-400" />
                          {destination.averageBuyIn || 'Varies'}
                        </span>
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1 text-pink-400" />
                          {destination.bestTimeToVisit || 'Year-round'}
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
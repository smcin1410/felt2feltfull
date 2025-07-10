'use client';

import { useState } from 'react';
import { FaMapMarkerAlt, FaTrophy, FaCalendarAlt, FaDollarSign, FaTrash, FaEdit, FaSave, FaPlane } from 'react-icons/fa';
import { Destination, Tournament } from '@/lib/types';

interface TripSummaryProps {
  selectedDestinations: Destination[];
  selectedTournaments: Tournament[];
  onRemoveDestination: (destinationId: string) => void;
  onRemoveTournament: (tournamentId: string) => void;
  className?: string;
}

export default function TripSummary({
  selectedDestinations,
  selectedTournaments,
  onRemoveDestination,
  onRemoveTournament,
  className = ''
}: TripSummaryProps) {
  const [tripName, setTripName] = useState('My Poker Trip');
  const [isEditingName, setIsEditingName] = useState(false);
  const [notes, setNotes] = useState('');

  // Calculate trip statistics
  const totalDestinations = selectedDestinations.length;
  const totalTournaments = selectedTournaments.length;
  const totalBuyIns = selectedTournaments.reduce((sum, tournament) => sum + tournament.buyIn, 0);
  const totalPrizePools = selectedTournaments.reduce((sum, tournament) => sum + tournament.prizePool, 0);

  // Get date range for tournaments
  const tournamentDates = selectedTournaments.map(t => new Date(t.date)).sort((a, b) => a.getTime() - b.getTime());
  const earliestDate = tournamentDates.length > 0 ? tournamentDates[0] : null;
  const latestDate = tournamentDates.length > 0 ? tournamentDates[tournamentDates.length - 1] : null;

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Handle saving trip name
  const handleSaveTripName = () => {
    setIsEditingName(false);
    // Here you could save to localStorage or send to API
  };

  // Handle exporting trip
  const handleExportTrip = () => {
    const tripData = {
      name: tripName,
      notes,
      destinations: selectedDestinations,
      tournaments: selectedTournaments,
      statistics: {
        totalDestinations,
        totalTournaments,
        totalBuyIns,
        totalPrizePools,
        dateRange: earliestDate && latestDate ? {
          start: formatDate(earliestDate),
          end: formatDate(latestDate)
        } : null
      },
      createdAt: new Date().toISOString()
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(tripData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${tripName.replace(/\s+/g, '_').toLowerCase()}_trip.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const hasItems = totalDestinations > 0 || totalTournaments > 0;

  return (
    <div className={`${className}`}>
      <div className="card-style p-6">
        {/* Trip Name Header */}
        <div className="mb-6">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-cyan-400 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveTripName()}
              />
              <button
                onClick={handleSaveTripName}
                className="p-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
              >
                <FaSave />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-orbitron font-bold neon-glow-pink">{tripName}</h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <FaEdit />
              </button>
            </div>
          )}
        </div>

        {!hasItems ? (
          // Empty State
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
              <FaPlane className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your trip summary will appear here once you add destinations and tournaments to your itinerary.
            </p>
          </div>
        ) : (
          <>
            {/* Trip Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{totalDestinations}</div>
                <div className="text-sm text-gray-400">Destination{totalDestinations !== 1 ? 's' : ''}</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{totalTournaments}</div>
                <div className="text-sm text-gray-400">Tournament{totalTournaments !== 1 ? 's' : ''}</div>
              </div>
              {totalTournaments > 0 && (
                <>
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-green-400">${totalBuyIns.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Buy-ins</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-yellow-400">${totalPrizePools.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Prize Pools</div>
                  </div>
                </>
              )}
            </div>

            {/* Date Range */}
            {earliestDate && latestDate && (
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center text-blue-400 mb-2">
                  <FaCalendarAlt className="mr-2" />
                  <span className="font-semibold">Trip Duration</span>
                </div>
                <div className="text-white">
                  {formatDate(earliestDate)} - {formatDate(latestDate)}
                </div>
              </div>
            )}

            {/* Selected Destinations */}
            {selectedDestinations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  Destinations ({selectedDestinations.length})
                </h3>
                <div className="space-y-2">
                  {selectedDestinations.map(destination => (
                    <div
                      key={destination._id}
                      className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-white">{destination.city}</div>
                        <div className="text-sm text-gray-400">{destination.country}</div>
                      </div>
                      <button
                        onClick={() => onRemoveDestination(destination._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Tournaments */}
            {selectedTournaments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                  <FaTrophy className="mr-2" />
                  Tournaments ({selectedTournaments.length})
                </h3>
                <div className="space-y-2">
                  {selectedTournaments.map(tournament => (
                    <div
                      key={tournament._id}
                      className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{tournament.name}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {tournament.location}
                          </span>
                          <span className="flex items-center">
                            <FaDollarSign className="mr-1" />
                            {tournament.buyIn.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            {formatDate(new Date(tournament.date))}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveTournament(tournament._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors ml-2"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trip Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trip Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about your trip..."
                className="w-full h-24 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleExportTrip}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <FaSave />
                Export Trip
              </button>
              <button
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  // Here you could implement sharing functionality
                  navigator.clipboard.writeText(window.location.href);
                  alert('Trip link copied to clipboard!');
                }}
              >
                <FaPlane />
                Share Trip
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
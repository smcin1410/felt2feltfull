'use client';

import { useState } from 'react';
import { FaSuitcaseRolling, FaMapMarkerAlt, FaTrophy, FaCalendarAlt, FaDollarSign, FaUsers, FaCheck } from 'react-icons/fa';
import { Tournament } from '@/lib/types';
import { useItineraryActions, useTournaments } from '@/store/itineraryStore';

interface TournamentItemProps {
  tournament: Tournament;
  layout?: 'card' | 'list';
  showAddButton?: boolean;
}

export default function TournamentItem({
  tournament,
  layout = 'list',
  showAddButton = true
}: TournamentItemProps) {
  const { addTournament } = useItineraryActions();
  const tournaments = useTournaments();
  const [isAdding, setIsAdding] = useState(false);

  // Check if tournament is already in itinerary
  const isInItinerary = tournaments.some(t => t._id === tournament._id);

  const handleAddToItinerary = async () => {
    if (isInItinerary) return;
    
    setIsAdding(true);
    try {
      // Pass the full tournament object to the store
      addTournament(tournament);
      
      // Brief visual feedback
      setTimeout(() => setIsAdding(false), 1000);
    } catch (error) {
      console.error('Error adding to itinerary:', error);
      setIsAdding(false);
    }
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };


  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-400/20';
      case 'Upcoming': return 'text-cyan-400 bg-cyan-400/20';
      case 'Completed': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (layout === 'card') {
    return (
      <div className="card-style group hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
        {/* Tournament Image */}
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <img
            src={tournament.image || '/stock-photos/card.jpeg'}
            alt={tournament.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/stock-photos/card.jpeg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
            {tournament.status}
          </div>

          {/* Add to Itinerary Button */}
          {showAddButton && (
            <button
              onClick={handleAddToItinerary}
              disabled={isAdding || isInItinerary}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 shadow-lg ${
                isInItinerary
                  ? 'bg-green-500 text-white cursor-default'
                  : isAdding
                  ? 'bg-green-500 text-white'
                  : 'bg-accent-hotpink hover:bg-pink-500 text-black hover:scale-110'
              }`}
              aria-label={`${isInItinerary ? 'Already in itinerary' : `Add ${tournament.name} to itinerary`}`}
            >
              {isInItinerary ? (
                <FaCheck size={20} />
              ) : isAdding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaSuitcaseRolling size={20} />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-2 font-orbitron neon-glow group-hover:text-cyan-400 transition-colors duration-300">
              {tournament.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <FaMapMarkerAlt size={14} />
              <span>{tournament.location}</span>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
            {tournament.description}
          </p>

          {/* Tournament Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-cyan-400">
              <FaCalendarAlt size={14} />
              <span>{formatDate(tournament.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <FaDollarSign size={14} />
              <span>${tournament.buyIn.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-pink-400">
              <FaTrophy size={14} />
              <span>${tournament.prizePool.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <FaUsers size={14} />
              <span>{tournament.players} players</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700/50">
            <button className="btn-secondary flex-1">
              View Details
            </button>
            {showAddButton && (
              <button
                onClick={handleAddToItinerary}
                disabled={isAdding || isInItinerary}
                className={`btn-primary flex items-center justify-center gap-2 px-6 ${
                  isInItinerary
                    ? 'bg-green-500 hover:bg-green-500 cursor-default'
                    : isAdding
                    ? 'opacity-75 cursor-not-allowed'
                    : ''
                }`}
              >
                {isInItinerary ? (
                  <>
                    <FaCheck />
                    In Itinerary
                  </>
                ) : isAdding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <FaSuitcaseRolling />
                    Add to Trip
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List layout (default)
  return (
    <div className="card-style flex flex-col md:flex-row items-center justify-between gap-6 hover:border-cyan-400/50 transition-all duration-300">
      <div className="flex items-center gap-6 text-center md:text-left flex-1">
        {/* Date Badge */}
        <div className="bg-gradient-to-br from-cyan-400 to-pink-500 text-black font-bold p-4 rounded-xl flex flex-col items-center justify-center w-24 h-24 shadow-lg flex-shrink-0">
          <span className="text-sm">{formatDate(tournament.date).split(' ')[0]}</span>
          <span className="text-2xl">{formatDate(tournament.date).split(' ')[1]}</span>
        </div>

        {/* Tournament Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold font-orbitron neon-glow truncate">{tournament.name}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
              {tournament.status}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300 text-lg mb-2">
            <FaMapMarkerAlt size={16} />
            <span>{tournament.location}</span>
          </div>
          
          <p className="text-gray-400 mb-3 line-clamp-2">{tournament.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-cyan-400">
              <FaDollarSign size={14} />
              <span>Buy-in: ${tournament.buyIn.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-pink-400">
              <FaTrophy size={14} />
              <span>Prize Pool: ${tournament.prizePool.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <FaUsers size={14} />
              <span>Players: {tournament.players}</span>
            </div>
            {tournament.endDate && (
              <div className="flex items-center gap-2 text-yellow-400">
                <FaCalendarAlt size={14} />
                <span>Ends: {formatDate(tournament.endDate)}</span>
              </div>
            )}
          </div>

          {/* Tournament Tags */}
          {tournament.tags && tournament.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tournament.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs border border-gray-600/30"
                >
                  {tag}
                </span>
              ))}
              {tournament.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs border border-gray-600/30">
                  +{tournament.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mt-4 md:mt-0 flex-shrink-0">
        <button className="btn-secondary">
          View Details
        </button>
        {showAddButton && (
          <button
            onClick={handleAddToItinerary}
            disabled={isAdding || isInItinerary}
            className={`btn-primary flex items-center gap-2 ${
              isInItinerary
                ? 'bg-green-500 hover:bg-green-500 cursor-default'
                : isAdding
                ? 'opacity-75 cursor-not-allowed'
                : ''
            }`}
          >
            {isInItinerary ? (
              <>
                <FaCheck />
                In Itinerary
              </>
            ) : isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <FaSuitcaseRolling />
                Add to Itinerary
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
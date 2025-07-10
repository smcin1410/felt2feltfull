'use client';

import { useState } from 'react';
import { FaSuitcaseRolling, FaMapMarkerAlt, FaTrophy, FaCheck } from 'react-icons/fa';
import { GiPokerHand } from 'react-icons/gi';
import { Destination } from '@/lib/types';
import { useItineraryActions, useDestinations } from '@/store/itineraryStore';

interface DestinationCardProps {
  destination: Destination;
  showAddButton?: boolean;
}

export default function DestinationCard({ destination, showAddButton = true }: DestinationCardProps) {
  const { addDestination } = useItineraryActions();
  const destinations = useDestinations();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Check if destination is already in itinerary
  const isInItinerary = destinations.some(dest => dest._id === destination._id);

  const handleAddToItinerary = async () => {
    if (isInItinerary) return;
    
    setIsAdding(true);
    try {
      // Pass the full destination object to the store
      addDestination(destination);
      
      // Brief visual feedback
      setTimeout(() => setIsAdding(false), 1000);
    } catch (error) {
      console.error('Error adding to itinerary:', error);
      setIsAdding(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="card-style group hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
      {/* Image Section */}
      <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
        <img
          src={imageError ? '/stock-photos/card.jpeg' : destination.image}
          alt={`${destination.city}, ${destination.country}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Location Badge */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
          <FaMapMarkerAlt className="text-cyan-400 text-sm" />
          <span className="text-white text-sm font-medium">{destination.country}</span>
        </div>

        {/* Add to Itinerary Button - Floating */}
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
            aria-label={`${isInItinerary ? 'Already in itinerary' : `Add ${destination.city} to itinerary`}`}
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

      {/* Content Section */}
      <div className="space-y-4">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold mb-2 font-orbitron neon-glow group-hover:text-cyan-400 transition-colors duration-300">
            {destination.city}
          </h2>
          <p className="text-gray-300 text-lg">{destination.country}</p>
        </div>

        {/* Description */}
        <p className="text-gray-400 leading-relaxed line-clamp-3">
          {destination.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <GiPokerHand size={16} />
              <span>{destination.pokerRooms.length} Rooms</span>
            </div>
            <div className="flex items-center gap-2 text-pink-400">
              <FaTrophy size={16} />
              <span>{destination.tournaments.length} Events</span>
            </div>
          </div>
          
          {destination.averageBuyIn && (
            <div className="text-green-400 font-medium">
              Avg: {destination.averageBuyIn}
            </div>
          )}
        </div>

        {/* Poker Rooms Preview */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <GiPokerHand size={16} />
            Poker Rooms ({destination.pokerRooms.length})
          </h3>
          <div className="space-y-1">
            {destination.pokerRooms.slice(0, 3).map(room => (
              <div key={room._id} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                <p className="text-sm text-gray-300 truncate">{room.name}</p>
              </div>
            ))}
            {destination.pokerRooms.length > 3 && (
              <p className="text-sm text-cyan-400 font-medium pl-4">
                + {destination.pokerRooms.length - 3} more rooms
              </p>
            )}
          </div>
        </div>

        {/* Tournaments Preview */}
        {destination.tournaments.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-pink-400 flex items-center gap-2">
              <FaTrophy size={16} />
              Upcoming Tournaments ({destination.tournaments.length})
            </h3>
            <div className="space-y-1">
              {destination.tournaments.slice(0, 2).map(tournament => (
                <div key={tournament._id} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full" />
                  <p className="text-sm text-gray-300 truncate">{tournament.name}</p>
                </div>
              ))}
              {destination.tournaments.length > 2 && (
                <p className="text-sm text-pink-400 font-medium pl-4">
                  + {destination.tournaments.length - 2} more events
                </p>
              )}
            </div>
          </div>
        )}

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
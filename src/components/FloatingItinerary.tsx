'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSuitcaseRolling, FaTimes, FaTrash, FaMapMarkerAlt, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import { useItineraryItems, useItineraryCount, useItineraryStats, useItineraryActions } from '@/store/itineraryStore';

const FloatingItinerary = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const items = useItineraryItems();
  const itemCount = useItineraryCount();
  const stats = useItineraryStats();
  const { removeDestination, removeTournament } = useItineraryActions();

  // Don't show if no items
  if (itemCount === 0) return null;

  // Handle removing items based on type
  const handleRemoveItem = (itemId: string, itemType: string) => {
    if (itemType === 'Destination') {
      removeDestination(itemId);
    } else if (itemType === 'Tournament') {
      removeTournament(itemId);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Navigate to trip designer
  const handlePlanTrip = () => {
    setIsOpen(false);
    router.push('/trip-designer');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-accent-hotpink hover:bg-pink-500 text-black p-4 rounded-full shadow-lg glow-on-hover transition-all duration-300 hover:scale-110"
        aria-label="View Itinerary"
      >
        <FaSuitcaseRolling size={24} />
        <span className="absolute -top-2 -right-2 bg-accent-neon text-black text-sm rounded-full h-6 w-6 flex items-center justify-center font-bold">
          {itemCount}
        </span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-accent-neon">Your Itinerary</h2>
                <p className="text-sm text-gray-400">{itemCount} item{itemCount !== 1 ? 's' : ''} selected</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Stats Summary */}
            {stats.totalBuyIns > 0 && (
              <div className="px-6 py-4 bg-gray-700/50 border-b border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-400">${stats.totalBuyIns.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Total Buy-ins</div>
                  </div>
                  {stats.dateRange.start && stats.dateRange.end && (
                    <div>
                      <div className="text-lg font-bold text-blue-400">
                        {formatDate(stats.dateRange.start.toISOString())} - {formatDate(stats.dateRange.end.toISOString())}
                      </div>
                      <div className="text-xs text-gray-400">Date Range</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              {itemCount === 0 ? (
                <p className="text-text-secondary text-center py-8">
                  Your itinerary is empty. Add tournaments or destinations to get started!
                </p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-start justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {item.type === 'Destination' ? (
                            <FaMapMarkerAlt className="text-cyan-400 flex-shrink-0" />
                          ) : (
                            <FaTrophy className="text-yellow-400 flex-shrink-0" />
                          )}
                          <h3 className="font-semibold text-text-primary truncate">{item.name}</h3>
                        </div>
                        
                        <div className="space-y-1">
                          {item.location && (
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              <FaMapMarkerAlt className="text-xs" />
                              {item.location}
                            </p>
                          )}
                          
                          {item.date && (
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              <FaCalendarAlt className="text-xs" />
                              {formatDate(item.date)}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.type === 'Destination'
                                ? 'bg-cyan-900/50 text-cyan-300'
                                : 'bg-yellow-900/50 text-yellow-300'
                            }`}>
                              {item.type}
                            </span>
                            
                            {item.priority && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.priority === 'High'
                                  ? 'bg-red-900/50 text-red-300'
                                  : item.priority === 'Medium'
                                  ? 'bg-orange-900/50 text-orange-300'
                                  : 'bg-gray-900/50 text-gray-300'
                              }`}>
                                {item.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item._id, item.type)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2 ml-2 flex-shrink-0"
                        aria-label={`Remove ${item.name} from itinerary`}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {itemCount > 0 && (
              <div className="p-6 border-t border-gray-700 space-y-3">
                <button
                  onClick={handlePlanTrip}
                  className="w-full bg-accent-neon hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Plan Your Trip
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Items are automatically saved to your browser
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingItinerary;
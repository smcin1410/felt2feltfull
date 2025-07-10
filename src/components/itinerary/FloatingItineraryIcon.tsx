'use client';

import { useState } from 'react';
import { useItineraryItems, useItineraryCount, useItineraryActions } from '@/store/itineraryStore';
import { FaShoppingBag, FaTimes, FaTrash, FaMapMarkerAlt, FaTrophy, FaCalendarAlt } from 'react-icons/fa';

const FloatingItineraryIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const items = useItineraryItems();
  const itemCount = useItineraryCount();
  const { removeDestination, removeTournament } = useItineraryActions();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Don't render the icon if the itinerary is empty
  if (itemCount === 0) {
    return null;
  }

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

  return (
    <>
      {/* Floating Icon */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-accent-hotpink text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent-neon focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label={`View Itinerary (${itemCount} items)`}
      >
        <FaShoppingBag size={24} />
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-neon text-sm font-bold text-gray-900">
          {itemCount}
        </span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Slide-out Sidebar */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-full sm:w-80 bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="itinerary-heading"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-700 p-6">
            <div>
              <h2 id="itinerary-heading" className="font-orbitron text-2xl text-accent-neon">
                Your Itinerary
              </h2>
              <p className="text-sm text-gray-400">{itemCount} item{itemCount !== 1 ? 's' : ''} selected</p>
            </div>
            <button 
              onClick={toggleSidebar} 
              className="text-white hover:text-accent-hotpink transition-colors duration-200 p-2"
              aria-label="Close itinerary"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {itemCount === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Your itinerary is empty. Add tournaments or destinations to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {item.type === 'Destination' ? (
                          <FaMapMarkerAlt className="text-cyan-400 flex-shrink-0" />
                        ) : (
                          <FaTrophy className="text-yellow-400 flex-shrink-0" />
                        )}
                        <h3 className="font-semibold text-white truncate">{item.name}</h3>
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
            <div className="border-t border-gray-700 p-6">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to trip designer - you can add router.push('/trip-designer') here if needed
                }}
                className="w-full bg-accent-neon hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Plan Your Trip
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Items are automatically saved to your browser
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FloatingItineraryIcon;
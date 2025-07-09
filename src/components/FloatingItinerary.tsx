'use client';

import { useState } from 'react';
import { useItinerary } from '@/app/context/ItineraryContext';
import { FaSuitcaseRolling, FaTimes, FaTrash } from 'react-icons/fa';

const FloatingItinerary = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem } = useItinerary();

  if (items.length === 0) return null;

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
          {items.length}
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
          <div className="relative bg-gray-800 rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-accent-neon">Your Itinerary</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              {items.length === 0 ? (
                <p className="text-text-secondary text-center py-8">
                  Your itinerary is empty. Add tournaments or destinations to get started!
                </p>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold text-text-primary">{item.name}</h3>
                        <p className="text-sm text-text-secondary">{item.type}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2"
                        aria-label={`Remove ${item.name} from itinerary`}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-700">
                <button className="w-full bg-accent-neon hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                  Plan Your Trip
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingItinerary;
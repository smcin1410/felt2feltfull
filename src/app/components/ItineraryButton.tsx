'use client';

import { useState } from 'react';
import { FaSuitcaseRolling, FaTimes } from 'react-icons/fa';
import { useItinerary } from '../context/ItineraryContext';

export default function ItineraryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem } = useItinerary();

  // Don't render anything if the itinerary is empty and the modal is closed
  if (items.length === 0 && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Floating Itinerary Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-accent-hotpink text-black rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 z-40"
        aria-label={`View Itinerary (${items.length} items)`}
      >
        <FaSuitcaseRolling size={28} />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent-light text-background-dark font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {/* Itinerary Summary Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-end z-50">
          <div className="w-full max-w-md h-full bg-gray-800 text-white shadow-xl flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-accent-light">Your Itinerary</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-grow p-6 overflow-y-auto">
              {items.length > 0 ? (
                <ul className="space-y-4">
                  {items.map(item => (
                    <li key={item._id} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-400">{item.type}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-400 font-semibold"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center mt-8">Your itinerary is empty. Add tournaments or destinations to get started.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
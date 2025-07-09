'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of an item in our itinerary
// Making it generic to hold different types of items, e.g., tournaments
interface ItineraryItem {
  _id: string;
  name: string; // e.g., tournament series or venue name
  type: 'Tournament' | 'Destination'; // To distinguish between item types
}

// Define the shape of our context
interface IItineraryContext {
  items: ItineraryItem[];
  addItem: (item: ItineraryItem) => void;
  removeItem: (itemId: string) => void;
}

// Create the context with a default value of undefined
const ItineraryContext = createContext<IItineraryContext | undefined>(undefined);

// Create the Provider component
export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItineraryItem[]>([]);

  const addItem = (item: ItineraryItem) => {
    // Prevent adding duplicates
    setItems(prevItems => {
      if (prevItems.find(i => i._id === item._id)) {
        return prevItems;
      }
      return [...prevItems, item];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item._id !== itemId));
  };

  return (
    <ItineraryContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </ItineraryContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (context === undefined) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
}
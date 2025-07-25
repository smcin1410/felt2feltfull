'use client';

import React, { useEffect, useState } from "react";

export default function TripPlannerTool() {
  const [tripItems, setTripItems] = useState<any[]>([]);

  // Load items sent to Trip Designer from localStorage
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('trip_designer_items') : null;
    if (stored) {
      try {
        setTripItems(JSON.parse(stored));
      } catch {}
    }
  }, []);

  return (
    <section className="bg-neutral-900 rounded-xl shadow-lg p-6 flex flex-col gap-8">
      {/* Items sent from Pre-Flop Planner */}
      <div>
        <h3 className="text-lg font-bold text-pink-400 mb-2">Your Trip Plan</h3>
        {tripItems.length === 0 ? (
          <div className="text-gray-400 italic">No items added yet. Use the Pre-Flop Planner to add destinations or tournaments.</div>
        ) : (
          <ul className="mb-4">
            {tripItems.map((item, idx) => (
              <li key={item.id + item.type} className="mb-2 p-2 rounded bg-black/60 text-white">
                <span className="font-semibold text-pink-200">{item.name}</span> <span className="text-xs text-gray-400">({item.type})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Step 1: Select a Destination */}
      <div>
        <label className="block text-lg font-semibold text-white mb-2">City</label>
        <select className="w-full bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500" disabled>
          <option>Could not load cities</option>
        </select>
      </div>
      {/* Map View Placeholder */}
      <div className="bg-black/60 rounded-lg h-48 flex items-center justify-center text-gray-400 italic">
        Map will appear here.
      </div>
      {/* Summary View Placeholder */}
      <div className="bg-black/60 rounded-lg p-4 flex items-center justify-center text-gray-400 italic">
        Your trip summary will appear here.
      </div>
    </section>
  );
} 
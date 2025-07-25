import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

// Mock itinerary data
const mockItinerary = [
  {
    date: "2025-08-15",
    items: [
      { id: "1", type: "flight", time: "09:00", title: "Flight to AC", participants: ["Alice", "Bob"] },
      { id: "2", type: "activity", time: "19:00", title: "Welcome Dinner", participants: ["Alice", "Bob", "Charlie"] },
    ],
  },
  {
    date: "2025-08-16",
    items: [
      { id: "3", type: "tournament", time: "12:00", title: "Main Event", participants: ["Alice"] },
      { id: "4", type: "activity", time: "21:00", title: "Night Out", participants: ["Bob", "Charlie"] },
    ],
  },
  {
    date: "2025-08-17",
    items: [
      { id: "5", type: "cash_game", time: "15:00", title: "Cash Game", participants: ["Alice", "Charlie"] },
    ],
  },
];

const Timeline = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalDay, setModalDay] = useState<string | null>(null);

  return (
    <div className="w-full">
      {mockItinerary.map(day => (
        <div key={day.date} className="mb-10 relative">
          {/* Day Label */}
          <div className="flex items-center mb-4">
            <div className="w-24 text-lg font-bold text-pink-400 flex-shrink-0">
              {new Date(day.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-pink-500/60 to-transparent" />
          </div>
          {/* Itinerary Items */}
          <div className="flex flex-col gap-4 ml-6">
            {day.items.map(item => (
              <div key={item.id} className="bg-gray-900/90 rounded-lg shadow-lg p-4 flex items-center gap-4 border border-gray-800 hover:shadow-[0_0_16px_#ff00cc99] transition-all">
                <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_8px_#ff00cc99]">
                  {item.type === "flight" ? "✈️" : item.type === "tournament" ? "🃏" : item.type === "cash_game" ? "💵" : "🎉"}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-white/90">{item.title}</div>
                  <div className="text-sm text-gray-400">{item.time} &middot; {item.participants.join(", ")}</div>
                </div>
              </div>
            ))}
            {/* Add Item Button */}
            <button
              className="absolute right-0 top-0 w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-500 flex items-center justify-center shadow-[0_0_8px_#ff00cc99] transition-all z-10"
              onClick={() => { setShowModal(true); setModalDay(day.date); }}
              title="Add item to this day"
            >
              <PlusIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      ))}
      {/* Add Item Modal (placeholder) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 shadow-2xl border border-pink-500 min-w-[320px]">
            <div className="text-xl font-bold text-pink-400 mb-4">Add Item ({modalDay})</div>
            <div className="text-gray-300 mb-4">(Form coming soon!)</div>
            <button className="px-4 py-2 rounded bg-pink-600 hover:bg-pink-500 text-white font-semibold" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline; 
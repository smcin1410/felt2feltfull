import React from "react";

export default function DestinationsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">
      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-bold neon-text mb-4 text-center">Destinations</h1>
      {/* Search/Filter Section Placeholder */}
      <section className="bg-black/60 rounded-xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled
          />
        </div>
        <button className="px-6 py-2 rounded bg-pink-600 text-white font-semibold shadow hover:bg-pink-500 transition" disabled>
          Filter
        </button>
      </section>
      {/* Results Area Placeholder */}
      <section className="flex-1 min-h-[300px] bg-gray-900/80 rounded-xl flex items-center justify-center text-gray-400 text-xl shadow-inner">
        Destinations will be displayed here.
      </section>
    </main>
  );
} 
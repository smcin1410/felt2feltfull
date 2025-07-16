export default function TripPlannerTool() {
  return (
    <section className="bg-neutral-900 rounded-xl shadow-lg p-6 flex flex-col gap-8">
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
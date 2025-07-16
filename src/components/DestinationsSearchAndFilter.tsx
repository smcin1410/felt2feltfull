export default function DestinationsSearchAndFilter() {
  return (
    <section className="bg-neutral-900 rounded-xl shadow-lg p-6 flex flex-col gap-6">
      <input
        type="text"
        className="w-full bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
        placeholder="Search by City, Venue, State or Country..."
        disabled
      />
      <div className="flex flex-col md:flex-row gap-4">
        <select className="flex-1 bg-gray-800/50 text-white rounded px-4 py-2" disabled>
          <option>All Countries</option>
        </select>
        <select className="flex-1 bg-gray-800/50 text-white rounded px-4 py-2" disabled>
          <option>All States/Provinces</option>
        </select>
        <select className="flex-1 bg-gray-800/50 text-white rounded px-4 py-2" disabled>
          <option>All Cities</option>
        </select>
      </div>
    </section>
  );
} 
import { Filter } from "lucide-react";

export default function TournamentsSearchAndFilter() {
  return (
    <section className="bg-neutral-900 rounded-xl shadow-lg p-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          className="flex-1 bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
          placeholder="Search by series, venue, or location..."
          disabled
        />
        <button className="flex items-center gap-2 px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-500 transition shadow" disabled>
          <Filter size={20} />
          Filters
        </button>
      </div>
    </section>
  );
} 
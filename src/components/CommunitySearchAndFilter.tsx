export default function CommunitySearchAndFilter() {
  return (
    <section className="bg-neutral-900 rounded-xl shadow-lg p-6 flex flex-col gap-6">
      <input
        type="text"
        className="w-full bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
        placeholder="Search posts by keyword..."
        disabled
      />
      <select className="bg-gray-800/50 text-white rounded px-4 py-2" disabled>
        <option>Filter by City</option>
      </select>
    </section>
  );
} 
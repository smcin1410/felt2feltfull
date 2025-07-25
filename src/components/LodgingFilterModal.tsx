import React, { useState } from "react";

interface LodgingFilterModalProps {
  onClose: () => void;
  onShowHotelsOnMap?: (hotels: any[], selectedId?: string) => void;
}

const AMENITIES = ["Pool", "Hot Tub", "Gym", "Free WiFi", "Parking", "Breakfast", "Pet Friendly"];
const PRIORITIES = ["Price", "Luxury", "Reviews", "Location"];

// For demo: Las Vegas Strip coordinates
const DEFAULT_LOCATION = { lat: 36.1147, lng: -115.1728 };

export default function LodgingFilterModal({ onClose, onShowHotelsOnMap }: LodgingFilterModalProps) {
  const [budget, setBudget] = useState(200);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priority, setPriority] = useState("Price");
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHotels([]);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const location = `${DEFAULT_LOCATION.lat},${DEFAULT_LOCATION.lng}`;
      const radius = 5000; // 5km
      const type = "lodging";
      // Basic filter: price_level (1-4), but not all hotels have this
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("Failed to fetch hotels");
      const data = await res.json();
      setHotels(data.results || []);
      if (onShowHotelsOnMap) onShowHotelsOnMap(data.results || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleHotelClick = (hotel: any) => {
    if (onShowHotelsOnMap) onShowHotelsOnMap(hotels, hotel.place_id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-neutral-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-pink-400">Find Lodging</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-300 hover:text-pink-400 text-2xl font-bold">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Budget */}
          <div>
            <label className="block text-pink-300 font-semibold mb-1">Budget per Night ($)</label>
            <input
              type="number"
              min={50}
              max={2000}
              step={10}
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="w-full bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
            />
          </div>
          {/* Amenities */}
          <div>
            <label className="block text-pink-300 font-semibold mb-1">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(a => (
                <button
                  type="button"
                  key={a}
                  className={`px-3 py-1 rounded-full border-2 text-sm font-medium transition-all ${selectedAmenities.includes(a) ? "bg-pink-500 border-pink-400 text-white" : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-pink-700/30"}`}
                  onClick={() => toggleAmenity(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          {/* Priorities */}
          <div>
            <label className="block text-pink-300 font-semibold mb-1">What's most important?</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-4 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-pink-600 text-white font-bold hover:bg-pink-500 shadow-lg" disabled={loading}>{loading ? "Searching..." : "Search Hotels"}</button>
          </div>
        </form>
        {/* Results */}
        <div className="mt-6">
          {loading && <div className="text-pink-400 text-center">Loading hotels...</div>}
          {error && <div className="text-red-400 text-center">{error}</div>}
          {hotels.length > 0 && (
            <div className="flex flex-col gap-4 max-h-80 overflow-y-auto mt-4">
              {hotels.map((hotel) => (
                <div key={hotel.place_id} className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center shadow border border-pink-500/20 cursor-pointer" onClick={() => handleHotelClick(hotel)}>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-pink-200">{hotel.name}</div>
                    <div className="text-gray-300 text-sm">{hotel.vicinity}</div>
                    {hotel.rating && <div className="text-yellow-400 text-xs">Rating: {hotel.rating} ⭐ ({hotel.user_ratings_total} reviews)</div>}
                  </div>
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${hotel.place_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-pink-600 text-white font-bold hover:bg-pink-500 shadow-lg mt-2 md:mt-0"
                    onClick={e => e.stopPropagation()}
                  >
                    Book
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
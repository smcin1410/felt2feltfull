import React, { useEffect, useState } from 'react';

interface Destination {
  id: string;
  name: string;
  location: string;
  pokerRoomInfo?: string;
  amenities?: string[];
}

interface DestinationManagerProps {
  destinations: Destination[];
  onAdd: (destination: Destination) => void;
  onRemove: (id: string) => void;
}

const DestinationManager: React.FC<DestinationManagerProps> = ({ destinations, onAdd, onRemove }) => {
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => setAllDestinations(data));
  }, []);

  const handleAdd = () => {
    const dest = allDestinations.find(d => d.id === selectedId);
    if (dest && !destinations.some(d => d.id === dest.id)) {
      onAdd(dest);
      setSelectedId('');
    }
  };

  return (
    <div className="border border-gray-700 rounded-xl p-4 mb-6 bg-gray-900/80 text-gray-100">
      <h3 className="text-lg font-semibold mb-2">Destinations</h3>
      <ul className="mb-4">
        {destinations.map((dest) => (
          <li key={dest.id} className="flex items-center justify-between mb-1">
            <span>{dest.name} <span className="text-gray-400">- {dest.location}</span>{dest.pokerRoomInfo && <span className="text-gray-500"> ({dest.pokerRoomInfo})</span>}</span>
            <button className="ml-2 px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs" onClick={() => onRemove(dest.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h4 className="font-semibold mb-1">Add Destination</h4>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="mr-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
        >
          <option value="">Select a destination...</option>
          {allDestinations
            .filter(d => !destinations.some(existing => existing.id === d.id))
            .map(d => (
              <option key={d.id} value={d.id}>
                {d.name} - {d.location}
              </option>
            ))}
        </select>
        <button className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm" onClick={handleAdd} disabled={!selectedId}>
          Add
        </button>
      </div>
    </div>
  );
};

export default DestinationManager; 
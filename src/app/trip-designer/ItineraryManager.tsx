import React, { useState } from 'react';

interface ItineraryItem {
  id: string;
  type: string;
  title: string;
  details?: string;
  startDate: string;
  endDate?: string;
  destinationId?: string;
  participants?: string[];
}

interface Destination {
  id: string;
  name: string;
  location: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface ItineraryManagerProps {
  items: ItineraryItem[];
  onAdd: (item: ItineraryItem) => void;
  onRemove: (id: string) => void;
  destinations: Destination[];
  travelers: User[];
}

const defaultNewItem = {
  type: 'tournament',
  title: '',
  details: '',
  startDate: '',
  endDate: '',
  destinationId: '',
  participants: [] as string[],
};

const ItineraryManager: React.FC<ItineraryManagerProps> = ({ items, onAdd, onRemove, destinations, travelers }) => {
  const [newItem, setNewItem] = useState<any>(defaultNewItem);

  const handleAdd = () => {
    if (!newItem.title || !newItem.startDate) return;
    onAdd({
      ...newItem,
      id: 'new-' + Date.now(),
      participants: newItem.participants || [],
    });
    setNewItem(defaultNewItem);
  };

  return (
    <div className="border border-gray-700 rounded-xl p-4 mb-6 bg-gray-900/80 text-gray-100">
      <h3 className="text-lg font-semibold mb-2">Itinerary</h3>
      <ul className="mb-4">
        {items.map((item) => (
          <li key={item.id} className="mb-2">
            <strong>{item.title}</strong> <span className="text-gray-400">({item.type})</span><br />
            <span className="text-gray-300">{item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}</span>
            {item.details && <div className="text-gray-400">{item.details}</div>}
            {item.destinationId && (
              <div className="text-gray-400">
                <em>Destination:</em> {destinations.find(d => d.id === item.destinationId)?.name || 'N/A'}
              </div>
            )}
            {item.participants && item.participants.length > 0 && (
              <div className="text-gray-400">
                <em>Participants:</em> {item.participants.map(pid => travelers.find(t => t.id === pid)?.name || pid).join(', ')}
              </div>
            )}
            <button className="ml-2 px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs" onClick={() => onRemove(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h4 className="font-semibold mb-1">Add New Item</h4>
        <label className="block mb-1">
          Type:
          <select
            value={newItem.type}
            onChange={e => setNewItem({ ...newItem, type: e.target.value })}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
          >
            <option value="tournament">Tournament</option>
            <option value="cash_game">Cash Game</option>
            <option value="travel">Travel</option>
            <option value="lodging">Lodging</option>
            <option value="activity">Activity</option>
          </select>
        </label>
        <label className="block mb-1">
          Title:
          <input
            type="text"
            value={newItem.title}
            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
          />
        </label>
        <label className="block mb-1">
          Start Date:
          <input
            type="date"
            value={newItem.startDate}
            onChange={e => setNewItem({ ...newItem, startDate: e.target.value })}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
          />
        </label>
        <label className="block mb-1">
          End Date:
          <input
            type="date"
            value={newItem.endDate}
            onChange={e => setNewItem({ ...newItem, endDate: e.target.value })}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
          />
        </label>
        <label className="block mb-1">
          Details:
          <input
            type="text"
            value={newItem.details}
            onChange={e => setNewItem({ ...newItem, details: e.target.value })}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white w-52"
          />
        </label>
        <label className="block mb-1">
          Destination:
          <select
            value={newItem.destinationId}
            onChange={e => setNewItem({ ...newItem, destinationId: e.target.value })}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
          >
            <option value="">Select...</option>
            {destinations.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
        <label className="block mb-1">
          Participants:
          <select
            multiple
            value={newItem.participants}
            onChange={e => {
              const options = Array.from(e.target.selectedOptions).map(o => o.value);
              setNewItem({ ...newItem, participants: options });
            }}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white min-w-[120px]"
          >
            {travelers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>
        <button className="mt-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm" onClick={handleAdd}>
          Add Item
        </button>
      </div>
    </div>
  );
};

export default ItineraryManager; 
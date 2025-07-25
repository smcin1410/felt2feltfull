import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface TravelerManagerProps {
  travelers: User[];
  onAdd: (user: User) => void;
  onRemove: (id: string) => void;
}

const TravelerManager: React.FC<TravelerManagerProps> = ({ travelers, onAdd, onRemove }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = () => {
    if (!name || !email) return;
    onAdd({ id: 'new-' + Date.now(), name, email });
    setName('');
    setEmail('');
  };

  return (
    <div className="border border-gray-700 rounded-xl p-4 mb-6 bg-gray-900/80 text-gray-100">
      <h3 className="text-lg font-semibold mb-2">Travelers</h3>
      <ul className="mb-4">
        {travelers.map((user) => (
          <li key={user.id} className="flex items-center justify-between mb-1">
            <span>{user.name} <span className="text-gray-400">({user.email})</span></span>
            <button className="ml-2 px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs" onClick={() => onRemove(user.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h4 className="font-semibold mb-1">Add New Traveler</h4>
        <label className="block mb-1">
          Name:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
          />
        </label>
        <label className="block mb-1">
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
          />
        </label>
        <button className="mt-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm" onClick={handleAdd}>
          Add Traveler
        </button>
      </div>
    </div>
  );
};

export default TravelerManager; 
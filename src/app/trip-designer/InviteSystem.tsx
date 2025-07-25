import React, { useState } from 'react';

interface InviteSystemProps {
  tripId: string;
}

const InviteSystem: React.FC<InviteSystemProps> = ({ tripId }) => {
  const [email, setEmail] = useState('');
  const [pendingInvites, setPendingInvites] = useState<string[]>([]);
  const [showLink, setShowLink] = useState(false);

  const handleInvite = () => {
    if (!email) return;
    setPendingInvites([...pendingInvites, email]);
    setEmail('');
  };

  const inviteLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/trip-designer?invite=${tripId}`;

  return (
    <div className="border border-gray-700 rounded-xl p-4 mb-6 bg-gray-900/80 text-gray-100">
      <h3 className="text-lg font-semibold mb-2">Invite Friends</h3>
      <div className="mb-2">
        <label className="block mb-1">
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
          />
        </label>
        <button className="ml-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm" onClick={handleInvite}>
          Invite
        </button>
      </div>
      <div className="mt-2">
        <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm" onClick={() => setShowLink(!showLink)}>
          {showLink ? 'Hide' : 'Show'} Shareable Invite Link
        </button>
        {showLink && (
          <div className="mt-2">
            <input type="text" value={inviteLink} readOnly className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
        )}
      </div>
      {pendingInvites.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-1">Pending Invites</h4>
          <ul className="list-disc list-inside">
            {pendingInvites.map((inv, idx) => (
              <li key={idx}>{inv}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InviteSystem; 
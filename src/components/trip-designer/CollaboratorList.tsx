'use client';

import { Users, Crown, Edit, Eye, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface Collaborator {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: 'editor' | 'viewer';
}

interface Owner {
  _id: string;
  name: string;
  email: string;
}

interface CollaboratorListProps {
  owner: Owner;
  collaborators: Collaborator[];
  currentUserId: string;
  isOwner: boolean;
}

export default function CollaboratorList({ 
  owner, 
  collaborators, 
  currentUserId, 
  isOwner 
}: CollaboratorListProps) {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'editor':
        return <Edit className="w-4 h-4 text-green-400" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'text-yellow-400';
      case 'editor':
        return 'text-green-400';
      case 'viewer':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const allMembers = [
    { ...owner, role: 'owner', isOwner: true },
    ...collaborators.map(collab => ({
      ...collab.user,
      role: collab.role,
      isOwner: false
    }))
  ];

  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 text-accent-neon mr-2" />
        <h3 className="font-semibold text-white">
          Collaborators ({allMembers.length})
        </h3>
      </div>

      <div className="space-y-3">
        {allMembers.map((member) => (
          <div
            key={member._id}
            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {getInitials(member.name || member.email)}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-white">
                    {member.name || member.email}
                    {member._id === currentUserId && (
                      <span className="text-gray-400 text-sm ml-1">(You)</span>
                    )}
                  </p>
                  {getRoleIcon(member.role)}
                </div>
                <p className="text-sm text-gray-400">{member.email}</p>
              </div>
            </div>

            {/* Role Badge */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium capitalize ${getRoleColor(member.role)}`}>
                {member.role}
              </span>

              {/* Actions (only for owner) */}
              {isOwner && !member.isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(showDropdown === member._id ? null : member._id)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showDropdown === member._id && (
                    <div className="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        onClick={() => {
                          // TODO: Implement role change
                          setShowDropdown(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement remove collaborator
                          setShowDropdown(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {collaborators.length === 0 && (
        <div className="text-center py-6">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            No collaborators yet. Invite someone to start collaborating!
          </p>
        </div>
      )}
    </div>
  );
}
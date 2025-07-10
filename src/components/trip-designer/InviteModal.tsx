'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { X, Mail, UserPlus } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  itineraryId: string;
  itineraryName: string;
}

export default function InviteModal({ isOpen, onClose, itineraryId, itineraryName }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('viewer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/itinerary/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itineraryId,
          email: email.trim(),
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Invitation sent successfully!');
        setEmail('');
        setRole('viewer');
        onClose();
      } else {
        toast.error(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      toast.error('An error occurred while sending the invitation');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-orbitron font-bold text-white flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-accent-neon" />
            Invite Collaborator
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-gray-300 text-sm mb-4">
              Invite someone to collaborate on "<span className="font-medium text-white">{itineraryName}</span>"
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-neon transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                Permission Level
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-neon transition-colors"
              >
                <option value="viewer">Viewer - Can view the trip</option>
                <option value="editor">Editor - Can view and edit the trip</option>
              </select>
            </div>

            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-3">
              <p className="text-blue-300 text-sm">
                <span className="font-medium">Note:</span> The invited user will receive an email with a link to join this trip. 
                The invitation will expire in 24 hours.
              </p>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
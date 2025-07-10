'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface InvitationData {
  email: string;
  role: string;
  itinerary: {
    id: string;
    name: string;
  };
  invitedBy: {
    name: string;
    email: string;
  };
  expiresAt: string;
}

function InvitePageInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setIsLoading(false);
      return;
    }
    fetchInvitation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/itinerary/accept-invite?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setInvitation(data.invitation);
      } else {
        setError(data.error || 'Invalid invitation');
      }
    } catch (error) {
      setError('Failed to load invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!session) {
      // Redirect to sign in with return URL
      signIn(undefined, { callbackUrl: `/invite?token=${token}` });
      return;
    }

    setIsAccepting(true);

    try {
      const response = await fetch('/api/itinerary/accept-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Invitation accepted successfully!');
        router.push(`/trip-designer?itinerary=${data.itinerary.id}`);
      } else {
        toast.error(data.error || 'Failed to accept invitation');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-neon mx-auto mb-4"></div>
          <p className="text-gray-300">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="card-style p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-orbitron font-bold mb-4 text-white">
              Invalid Invitation
            </h1>
            <p className="text-gray-300 mb-6">
              {error || 'This invitation link is invalid or has expired.'}
            </p>
            <Link href="/" className="btn-primary inline-block px-6 py-3">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = new Date(invitation.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card-style p-8">
          <div className="text-center mb-8">
            <div className="text-accent-neon text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-orbitron font-bold mb-2 neon-glow">
              You're Invited!
            </h1>
            <p className="text-gray-300">
              Join a collaborative poker trip
            </p>
          </div>

          {isExpired ? (
            <div className="text-center">
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
                <p className="text-red-400 font-medium">This invitation has expired</p>
              </div>
              <Link href="/" className="btn-primary inline-block px-6 py-3">
                Go to Homepage
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Trip Details</h3>
                  <p className="text-gray-300">
                    <span className="font-medium">Trip:</span> {invitation.itinerary.name}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium">Your Role:</span>{' '}
                    <span className={`capitalize ${
                      invitation.role === 'editor' ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {invitation.role}
                    </span>
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium">Invited by:</span> {invitation.invitedBy.name}
                  </p>
                </div>

                <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">
                    <span className="font-medium">Note:</span> As a {invitation.role}, you'll be able to{' '}
                    {invitation.role === 'editor' 
                      ? 'view and edit this trip itinerary'
                      : 'view this trip itinerary'
                    }.
                  </p>
                </div>
              </div>

              {!session ? (
                <div className="space-y-4">
                  <p className="text-gray-300 text-center mb-4">
                    You need to sign in to accept this invitation
                  </p>
                  <button
                    onClick={() => signIn(undefined, { callbackUrl: `/invite?token=${token}` })}
                    className="w-full btn-primary py-3"
                  >
                    Sign In to Accept
                  </button>
                  <p className="text-center text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link href={`/auth/signup?callbackUrl=${encodeURIComponent(`/invite?token=${token}`)}`} className="text-accent-neon hover:underline">
                      Create one here
                    </Link>
                  </p>
                </div>
              ) : session.user.email?.toLowerCase() !== invitation.email.toLowerCase() ? (
                <div className="text-center">
                  <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-6">
                    <p className="text-yellow-400">
                      This invitation is for {invitation.email}, but you're signed in as {session.user.email}.
                    </p>
                  </div>
                  <button
                    onClick={() => signIn()}
                    className="btn-secondary px-6 py-3"
                  >
                    Sign in with correct account
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAcceptInvitation}
                  disabled={isAccepting}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAccepting ? 'Accepting...' : 'Accept Invitation'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense>
      <InvitePageInner />
    </Suspense>
  );
}
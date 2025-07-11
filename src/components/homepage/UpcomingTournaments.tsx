'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Define the structure of a single tournament object
interface Tournament {
  _id: string;
  name: string;
  location: string;
  date: string;
  buyIn: number;
  description: string;
  image: string;
  prizePool: number;
  players: number;
  status: string;
}

const UpcomingTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch('/api/tournaments');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        
        // API now returns tournaments array directly
        const tournaments = await res.json();
        setTournaments(tournaments);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTournaments();
  }, []);

  return (
    <section className="tournaments-section py-8">
      <div className="tournaments-container max-w-3xl mx-auto">
        <h2 className="tournaments-section-title neon-glow text-3xl md:text-4xl font-bold text-center mb-8">
          Upcoming Tournaments
        </h2>
        <div className="tournaments-content">
          {loading && (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-neon mx-auto mb-4"></div>
              <p className="text-gray-300">Loading the latest events...</p>
            </div>
          )}
          {error && (
            <div className="text-center p-6 border border-accent-hotpink rounded-xl bg-[#181A20]/80">
              <p className="text-accent-hotpink font-semibold">Error: {error}</p>
            </div>
          )}
          {!loading && !error && (
            <div className="w-full">
              {tournaments.length > 0 ? (
                <ul className="divide-y divide-gray-700 w-full">
                  {tournaments.map((t) => (
                    <li key={t._id} className="py-4 text-center">
                      <span className="font-bold text-lg text-white">{t.name}</span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="text-gray-300">{t.location}</span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="text-gray-400">{format(new Date(t.date), 'MMM dd, yyyy')}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <h3 className="neon-glow text-xl mb-2">🎰 Big Events Coming Soon!</h3>
                  <p className="text-gray-300">
                    We're working with top casinos to bring you the hottest tournaments in Vegas and beyond.
                  </p>
                  <p className="text-accent-neon mt-2">
                    Be the first to know when they drop! 🔥
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpcomingTournaments;
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
    <section>
      <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-12 neon-glow">
        Upcoming Tournaments
      </h2>
      <div className="card-style p-8 min-h-[200px] flex justify-center items-center">
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading the latest events...</p>
          </div>
        )}
        {error && (
          <div className="text-center p-6 bg-red-900/20 rounded-lg border border-red-500/30">
            <p className="text-red-400 font-semibold">Error: {error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="w-full">
            {tournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((t) => (
                  <div key={t._id} className="card-style p-6 hover:border-cyan-400/50 transition-all duration-300">
                    <h3 className="font-bold text-xl text-white mb-2">{t.name}</h3>
                    <p className="text-gray-300 mb-1">{t.location}</p>
                    <p className="text-cyan-400 font-semibold">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg">No upcoming tournaments found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingTournaments;
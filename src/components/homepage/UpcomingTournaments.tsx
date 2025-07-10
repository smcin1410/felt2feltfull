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
      <h2 className="font-vegas text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 neon-glow">
        Upcoming Tournaments
      </h2>
      <div className="card-style p-4 md:p-8 min-h-[200px] flex justify-center items-center">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {tournaments.map((t) => (
                  <div key={t._id} className="card-style p-4 md:p-6 hover:border-cyan-400/50 transition-all duration-300">
                    <h3 className="font-bold text-lg md:text-xl text-white mb-2">{t.name}</h3>
                    <p className="text-gray-300 mb-1 text-sm md:text-base">{t.location}</p>
                    <p className="text-cyan-400 font-semibold text-sm md:text-base">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <div className="max-w-md mx-auto">
                  <div className="bg-gradient-to-r from-pink-500/20 to-cyan-400/20 rounded-lg p-6 md:p-8 border border-pink-500/30">
                    <h3 className="font-vegas text-xl md:text-2xl text-pink-400 mb-4">🎰 Big Events Coming Soon!</h3>
                    <p className="text-gray-300 text-base md:text-lg mb-4">
                      We're working with top casinos to bring you the hottest tournaments in Vegas and beyond.
                    </p>
                    <p className="text-cyan-400 font-semibold text-sm md:text-base">
                      Be the first to know when they drop! 🔥
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingTournaments;
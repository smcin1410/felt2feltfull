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
    <section className="tournaments-section">
      <div className="tournaments-container">
        <h2 className="tournaments-section-title">
          Upcoming Tournaments
        </h2>
        <div className="tournaments-content">
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
          <div className="tournaments-grid-wrapper">
            {tournaments.length > 0 ? (
              <div className="tournaments-grid">
                {tournaments.map((t) => (
                  <div key={t._id} className="tournament-card">
                    <h3 className="tournament-card-title">{t.name}</h3>
                    <p className="tournament-card-location">{t.location}</p>
                    <p className="tournament-card-date">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tournaments-empty-state">
                <div className="tournaments-empty-card">
                  <h3 className="tournaments-empty-title">🎰 Big Events Coming Soon!</h3>
                  <p className="tournaments-empty-text">
                    We're working with top casinos to bring you the hottest tournaments in Vegas and beyond.
                  </p>
                  <p className="tournaments-empty-cta">
                    Be the first to know when they drop! 🔥
                  </p>
                </div>
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
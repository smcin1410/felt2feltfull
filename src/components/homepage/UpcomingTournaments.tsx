'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Define the structure of a single tournament object
interface Tournament {
  _id: string;
  seriesName: string;
  city: string;
  startDate: string;
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
        
        // **FIX 1: Get the 'data' property from the JSON response**
        const responseData = await res.json();
        setTournaments(responseData.data);

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
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400" style={{ textShadow: '0 0 8px #22d3ee' }}>
        Upcoming Tournaments
      </h2>
      <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700 min-h-[150px] flex justify-center items-center">
        {loading && <p className="text-gray-400">Loading the latest events...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}
        {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {tournaments.length > 0 ? (
                tournaments.map((t) => (
                    <div key={t._id} className="bg-gray-700 p-4 rounded-lg text-left">
                      {/* **FIX 2: Use the correct property names from your data** */}
                      <h3 className="font-bold text-lg text-white">{t.seriesName}</h3>
                      <p className="text-gray-400">{t.city}</p>
                      <p className="text-sm text-cyan-400">{format(new Date(t.startDate), 'MMM dd, yyyy')}</p>
                    </div>
                ))
                ) : (
                <p className="col-span-full">No upcoming tournaments found.</p>
                )}
            </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingTournaments;
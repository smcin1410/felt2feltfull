import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Destination, Tournament, ItineraryItem } from '@/lib/types';

interface ItineraryStore {
  // State
  destinations: Destination[];
  tournaments: Tournament[];
  items: ItineraryItem[];
  isLoading: boolean;
  error: string | null;

  // Actions for destinations
  addDestination: (destination: Destination) => void;
  removeDestination: (destinationId: string) => void;
  clearDestinations: () => void;

  // Actions for tournaments
  addTournament: (tournament: Tournament) => void;
  removeTournament: (tournamentId: string) => void;
  clearTournaments: () => void;

  // Actions for generic itinerary items
  addItem: (item: ItineraryItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<ItineraryItem>) => void;
  clearItems: () => void;

  // Utility actions
  clearAll: () => void;
  getItemCount: () => number;
  getTotalBuyIns: () => number;
  getDateRange: () => { start: Date | null; end: Date | null };
  
  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useItineraryStore = create<ItineraryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      destinations: [],
      tournaments: [],
      items: [],
      isLoading: false,
      error: null,

      // Destination actions
      addDestination: (destination) => {
        const { destinations } = get();
        const exists = destinations.some(d => d._id === destination._id);
        
        if (!exists) {
          set((state) => ({
            destinations: [...state.destinations, destination],
            error: null
          }));

          // Also add as generic itinerary item
          const itineraryItem: ItineraryItem = {
            _id: destination._id,
            name: destination.city,
            type: 'Destination',
            location: `${destination.city}, ${destination.country}`,
            priority: 'Medium'
          };
          
          get().addItem(itineraryItem);
        }
      },

      removeDestination: (destinationId) => {
        set((state) => ({
          destinations: state.destinations.filter(d => d._id !== destinationId)
        }));
        
        // Also remove from generic items
        get().removeItem(destinationId);
      },

      clearDestinations: () => {
        const { destinations } = get();
        set({ destinations: [] });
        
        // Remove destination items from generic items
        destinations.forEach(dest => get().removeItem(dest._id));
      },

      // Tournament actions
      addTournament: (tournament) => {
        const { tournaments } = get();
        const exists = tournaments.some(t => t._id === tournament._id);
        
        if (!exists) {
          set((state) => ({
            tournaments: [...state.tournaments, tournament],
            error: null
          }));

          // Also add as generic itinerary item
          const itineraryItem: ItineraryItem = {
            _id: tournament._id,
            name: tournament.name,
            type: 'Tournament',
            location: tournament.location,
            date: tournament.date,
            priority: 'High'
          };
          
          get().addItem(itineraryItem);
        }
      },

      removeTournament: (tournamentId) => {
        set((state) => ({
          tournaments: state.tournaments.filter(t => t._id !== tournamentId)
        }));
        
        // Also remove from generic items
        get().removeItem(tournamentId);
      },

      clearTournaments: () => {
        const { tournaments } = get();
        set({ tournaments: [] });
        
        // Remove tournament items from generic items
        tournaments.forEach(tournament => get().removeItem(tournament._id));
      },

      // Generic itinerary item actions
      addItem: (item) => {
        const { items } = get();
        const exists = items.some(i => i._id === item._id);
        
        if (!exists) {
          set((state) => ({
            items: [...state.items, item],
            error: null
          }));
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item._id !== itemId)
        }));
      },

      updateItem: (itemId, updates) => {
        set((state) => ({
          items: state.items.map(item =>
            item._id === itemId ? { ...item, ...updates } : item
          )
        }));
      },

      clearItems: () => {
        set({ items: [] });
      },

      // Utility actions
      clearAll: () => {
        set({
          destinations: [],
          tournaments: [],
          items: [],
          error: null
        });
      },

      getItemCount: () => {
        const { destinations, tournaments } = get();
        return destinations.length + tournaments.length;
      },

      getTotalBuyIns: () => {
        const { tournaments } = get();
        return tournaments.reduce((total, tournament) => total + tournament.buyIn, 0);
      },

      getDateRange: () => {
        const { tournaments } = get();
        
        if (tournaments.length === 0) {
          return { start: null, end: null };
        }

        const dates = tournaments.map(t => new Date(t.date)).sort((a, b) => a.getTime() - b.getTime());
        return {
          start: dates[0],
          end: dates[dates.length - 1]
        };
      },

      // Loading and error state actions
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      }
    }),
    {
      name: 'felt2felt-itinerary', // localStorage key
      storage: createJSONStorage(() => localStorage),
      
      // Only persist the core data, not loading/error states
      partialize: (state) => ({
        destinations: state.destinations,
        tournaments: state.tournaments,
        items: state.items
      }),

      // Handle rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
          state.error = null;
        }
      },

      // Version for migration if needed in the future
      version: 1,
    }
  )
);

// Selector hooks for better performance
export const useDestinations = () => useItineraryStore((state) => state.destinations);
export const useTournaments = () => useItineraryStore((state) => state.tournaments);
export const useItineraryItems = () => useItineraryStore((state) => state.items);
export const useItineraryCount = () => useItineraryStore((state) => state.getItemCount());
// Individual selector hooks to avoid object creation issues
export const useTotalBuyIns = () => useItineraryStore((state) =>
  state.tournaments.reduce((total, tournament) => total + tournament.buyIn, 0)
);

import { useMemo } from 'react';
export const useDateRange = () => {
  const tournaments = useItineraryStore(state => state.tournaments);
  return useMemo(() => {
    if (tournaments.length === 0) {
      return { start: null, end: null };
    }
    const dates = tournaments.map(t => new Date(t.date)).sort((a, b) => a.getTime() - b.getTime());
    return {
      start: dates[0],
      end: dates[dates.length - 1]
    };
  }, [tournaments]);
};

// Keep the combined hook but use individual selectors
export const useItineraryStats = () => {
  const totalBuyIns = useTotalBuyIns();
  const dateRange = useDateRange();
  const itemCount = useItineraryCount();
  
  return {
    totalBuyIns,
    dateRange,
    itemCount
  };
};

// Action hooks
export const useItineraryActions = () => {
  const addDestination = useItineraryStore(state => state.addDestination);
  const removeDestination = useItineraryStore(state => state.removeDestination);
  const addTournament = useItineraryStore(state => state.addTournament);
  const removeTournament = useItineraryStore(state => state.removeTournament);
  const clearAll = useItineraryStore(state => state.clearAll);
  const setLoading = useItineraryStore(state => state.setLoading);
  const setError = useItineraryStore(state => state.setError);

  return useMemo(() => ({
    addDestination,
    removeDestination,
    addTournament,
    removeTournament,
    clearAll,
    setLoading,
    setError
  }), [
    addDestination,
    removeDestination,
    addTournament,
    removeTournament,
    clearAll,
    setLoading,
    setError
  ]);
};
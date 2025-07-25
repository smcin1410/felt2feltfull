import { User, Destination, ItineraryItem, Trip, Expense } from './types';

export const users: User[] = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com' },
  { id: 'u2', name: 'Bob', email: 'bob@example.com' },
  { id: 'u3', name: 'Charlie', email: 'charlie@example.com' },
];

export const destinations: Destination[] = [
  { id: 'd1', name: 'Borgata', location: 'Atlantic City, NJ', pokerRoomInfo: '50 tables', amenities: ['Hotel', 'Spa', 'Restaurants'] },
  { id: 'd2', name: 'Bellagio', location: 'Las Vegas, NV', pokerRoomInfo: '40 tables', amenities: ['Hotel', 'Fine Dining', 'Fountains'] },
  { id: 'd3', name: 'Rivers Casino', location: 'Pittsburgh, PA', pokerRoomInfo: '30 tables', amenities: ['Hotel', 'Bar', 'Poker Room'] },
];

export const tournaments: ItineraryItem[] = [
  {
    id: 't1',
    type: 'tournament',
    title: 'Borgata Summer Poker Open',
    details: 'Main Event - $500K GTD',
    startDate: '2025-08-10',
    endDate: '2025-08-15',
    destinationId: 'd1',
    participants: ['u1', 'u2'],
  },
  {
    id: 't2',
    type: 'tournament',
    title: 'Bellagio Cup',
    details: '$10K Buy-in',
    startDate: '2025-09-01',
    endDate: '2025-09-05',
    destinationId: 'd2',
    participants: ['u2', 'u3'],
  },
];

export const sampleTrip: Trip = {
  id: 'trip1',
  name: 'Vegas Poker Adventure',
  startDate: '2025-09-01',
  endDate: '2025-09-07',
  travelers: users,
  destinations: [destinations[1]],
  itinerary: [tournaments[1]],
  expenses: [
    { id: 'e1', description: 'Hotel', amount: 1200, paidBy: 'u1', splitBetween: ['u1', 'u2', 'u3'] },
    { id: 'e2', description: 'Dinner', amount: 300, paidBy: 'u2', splitBetween: ['u1', 'u2', 'u3'] },
  ],
}; 
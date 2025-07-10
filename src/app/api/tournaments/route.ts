import { NextResponse } from 'next/server';

// Mock data for tournaments
const mockTournaments = [
  {
    _id: '1',
    name: 'WSOP Main Event',
    location: 'Las Vegas, USA',
    buyIn: 10000,
    date: '2024-07-15T18:00:00Z',
    endDate: '2024-07-28T23:00:00Z',
    description: 'The most prestigious poker tournament in the world',
    image: '/stock-photos/vegassign.jpeg',
    prizePool: 80000000,
    players: 8000,
    status: 'upcoming'
  },
  {
    _id: '2',
    name: 'EPT Monte Carlo',
    location: 'Monte Carlo, Monaco',
    buyIn: 5000,
    date: '2024-09-15T14:00:00Z',
    endDate: '2024-09-20T22:00:00Z',
    description: 'European Poker Tour flagship event',
    image: '/stock-photos/card.jpeg',
    prizePool: 2500000,
    players: 500,
    status: 'upcoming'
  },
  {
    _id: '3',
    name: 'Aria High Roller',
    location: 'Las Vegas, USA',
    buyIn: 25000,
    date: '2024-08-01T16:00:00Z',
    endDate: '2024-08-05T20:00:00Z',
    description: 'High stakes tournament for serious players',
    image: '/stock-photos/southfloridanight.jpeg',
    prizePool: 5000000,
    players: 200,
    status: 'upcoming'
  },
  {
    _id: '4',
    name: 'Macau Poker Cup',
    location: 'Macau, China',
    buyIn: 3000,
    date: '2024-10-01T12:00:00Z',
    endDate: '2024-10-06T18:00:00Z',
    description: 'Premier Asian poker championship',
    image: '/stock-photos/card.jpeg',
    prizePool: 1500000,
    players: 600,
    status: 'upcoming'
  },
  {
    _id: '5',
    name: 'GUKPT London',
    location: 'London, UK',
    buyIn: 1000,
    date: '2024-11-15T15:00:00Z',
    endDate: '2024-11-18T21:00:00Z',
    description: 'Grosvenor UK Poker Tour main event',
    image: '/stock-photos/card.jpeg',
    prizePool: 500000,
    players: 800,
    status: 'upcoming'
  },
  {
    _id: '6',
    name: 'WPT Championship',
    location: 'Las Vegas, USA',
    buyIn: 15000,
    date: '2024-12-10T17:00:00Z',
    endDate: '2024-12-15T23:00:00Z',
    description: 'World Poker Tour season finale',
    image: '/stock-photos/vegassign.jpeg',
    prizePool: 6000000,
    players: 400,
    status: 'upcoming'
  }
];

export async function GET() {
  try {
    // Return mock data instead of database query
    return NextResponse.json(mockTournaments);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
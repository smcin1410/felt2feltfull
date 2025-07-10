import { NextResponse } from 'next/server';

// Mock data for destinations
const mockDestinations = [
  {
    _id: '1',
    city: 'Las Vegas',
    country: 'USA',
    description: 'The poker capital of the world with world-class casinos and tournaments.',
    image: '/stock-photos/vegassign.jpeg',
    pokerRooms: [
      { _id: '1', name: 'Bellagio Poker Room', description: 'High-stakes poker in luxury' },
      { _id: '2', name: 'Aria Poker Room', description: 'Modern poker experience' },
      { _id: '3', name: 'WSOP at Paris', description: 'Home of the World Series of Poker' }
    ],
    tournaments: [
      { _id: '1', name: 'WSOP Main Event', buyIn: 10000, date: '2024-07-15' },
      { _id: '2', name: 'Aria High Roller', buyIn: 25000, date: '2024-08-01' }
    ]
  },
  {
    _id: '2',
    city: 'Monte Carlo',
    country: 'Monaco',
    description: 'Elegant European poker in the heart of the French Riviera.',
    image: '/stock-photos/card.jpeg',
    pokerRooms: [
      { _id: '4', name: 'Casino de Monte-Carlo', description: 'Historic luxury casino' },
      { _id: '5', name: 'Monte Carlo Bay', description: 'Modern gaming experience' }
    ],
    tournaments: [
      { _id: '3', name: 'EPT Monte Carlo', buyIn: 5000, date: '2024-09-15' }
    ]
  },
  {
    _id: '3',
    city: 'Macau',
    country: 'China',
    description: 'The Asian poker hub with massive tournaments and cash games.',
    image: '/stock-photos/card.jpeg',
    pokerRooms: [
      { _id: '6', name: 'City of Dreams', description: 'Premier Asian poker destination' },
      { _id: '7', name: 'Wynn Macau', description: 'Luxury poker experience' }
    ],
    tournaments: [
      { _id: '4', name: 'Macau Poker Cup', buyIn: 3000, date: '2024-10-01' }
    ]
  },
  {
    _id: '4',
    city: 'London',
    country: 'UK',
    description: 'Classic European poker scene with historic venues.',
    image: '/stock-photos/card.jpeg',
    pokerRooms: [
      { _id: '8', name: 'The Hippodrome', description: 'London\'s premier poker room' },
      { _id: '9', name: 'Aspers Casino', description: 'Modern poker facility' }
    ],
    tournaments: [
      { _id: '5', name: 'GUKPT London', buyIn: 1000, date: '2024-11-15' }
    ]
  }
];

export async function GET() {
  try {
    // Return mock data instead of database query
    return NextResponse.json(mockDestinations, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
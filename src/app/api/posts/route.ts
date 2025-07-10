import { NextResponse } from 'next/server';

// Mock data for community posts
const mockCommunityPosts = [
  {
    _id: '1',
    title: 'Looking for travel partner to WSOP 2024',
    content: 'Hey everyone! I\'m planning to attend the WSOP Main Event this year and looking for someone to share accommodation costs. I\'m a recreational player from Chicago. Anyone interested?',
    author: 'PokerTraveler23',
    createdAt: '2024-01-20T09:15:00Z',
    replies: 12,
    likes: 8,
    category: 'Travel Partners',
    isBlogPost: false
  },
  {
    _id: '2',
    title: 'Best cash games in Atlantic City?',
    content: 'Visiting AC next weekend. What are the best rooms for 1/2 and 2/5 cash games? Looking for soft games and good action.',
    author: 'CashGameGrinder',
    createdAt: '2024-01-19T16:30:00Z',
    replies: 18,
    likes: 15,
    category: 'Poker Rooms',
    isBlogPost: false
  },
  {
    _id: '3',
    title: 'Trip Report: EPT Barcelona 2024',
    content: 'Just got back from Barcelona and what an amazing experience! The tournament was well-organized, the city is beautiful, and the poker was fantastic. Here\'s my detailed trip report...',
    author: 'EuroPokerFan',
    createdAt: '2024-01-18T14:45:00Z',
    replies: 25,
    likes: 32,
    category: 'Trip Reports',
    isBlogPost: false
  },
  {
    _id: '4',
    title: 'Bankroll management question',
    content: 'I\'ve been playing 1/2 live for about 6 months now. My bankroll is around $3000. Is this enough to move up to 2/5? What\'s the general rule for live cash games?',
    author: 'NewToLive',
    createdAt: '2024-01-17T11:20:00Z',
    replies: 31,
    likes: 22,
    category: 'Strategy',
    isBlogPost: false
  },
  {
    _id: '5',
    title: 'Macau poker scene - worth the trip?',
    content: 'Thinking about planning a poker trip to Macau. Has anyone been recently? How are the games and what should I expect in terms of stakes and competition level?',
    author: 'AsiaPokerExplorer',
    createdAt: '2024-01-16T20:10:00Z',
    replies: 14,
    likes: 19,
    category: 'Destinations',
    isBlogPost: false
  },
  {
    _id: '6',
    title: 'Live tells vs online reads',
    content: 'Made the transition from online to live poker recently. Finding it challenging to adjust to reading physical tells instead of betting patterns. Any tips for developing live reads?',
    author: 'OnlineToLive',
    createdAt: '2024-01-15T13:55:00Z',
    replies: 27,
    likes: 35,
    category: 'Strategy',
    isBlogPost: false
  }
];

export async function GET() {
  try {
    // Return mock data for community posts
    return NextResponse.json(mockCommunityPosts);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
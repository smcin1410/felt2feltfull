import { NextResponse } from 'next/server';

// Mock data for blog posts
const mockBlogPosts = [
  {
    _id: '1',
    title: 'The Ultimate Guide to Las Vegas Poker Rooms',
    slug: 'ultimate-guide-las-vegas-poker-rooms',
    excerpt: 'Discover the best poker rooms in Las Vegas, from the iconic Bellagio to the modern Aria. Learn about stakes, games, and what makes each room unique.',
    content: 'Las Vegas remains the poker capital of the world...',
    image: '/stock-photos/vegassign.jpeg',
    author: 'Mike Chen',
    createdAt: '2024-01-15T10:00:00Z',
    isBlogPost: true,
    tags: ['Las Vegas', 'Poker Rooms', 'Travel Guide']
  },
  {
    _id: '2',
    title: 'Tournament Strategy: Playing Deep Stack Events',
    slug: 'tournament-strategy-deep-stack-events',
    excerpt: 'Master the art of deep stack tournament play with advanced strategies for different stages of the tournament.',
    content: 'Deep stack tournaments require a different approach...',
    image: '/stock-photos/card.jpeg',
    author: 'Sarah Johnson',
    createdAt: '2024-01-10T14:30:00Z',
    isBlogPost: true,
    tags: ['Strategy', 'Tournaments', 'Deep Stack']
  },
  {
    _id: '3',
    title: 'European Poker Tour: A Player\'s Journey',
    slug: 'european-poker-tour-players-journey',
    excerpt: 'Follow one player\'s experience traveling the EPT circuit, from Barcelona to Monte Carlo.',
    content: 'The European Poker Tour offers some of the most prestigious...',
    image: '/stock-photos/southfloridanight.jpeg',
    author: 'Alex Rodriguez',
    createdAt: '2024-01-05T16:45:00Z',
    isBlogPost: true,
    tags: ['EPT', 'Travel', 'Tournament Series']
  },
  {
    _id: '4',
    title: 'Bankroll Management for Live Poker',
    slug: 'bankroll-management-live-poker',
    excerpt: 'Essential bankroll management tips for live poker players, including variance considerations and proper game selection.',
    content: 'Proper bankroll management is crucial for long-term success...',
    image: '/stock-photos/card.jpeg',
    author: 'David Kim',
    createdAt: '2024-01-01T12:00:00Z',
    isBlogPost: true,
    tags: ['Bankroll Management', 'Strategy', 'Live Poker']
  }
];

export async function GET() {
  try {
    // Return mock data with proper structure expected by components
    return NextResponse.json({ data: mockBlogPosts });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
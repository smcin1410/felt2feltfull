import { NextRequest, NextResponse } from 'next/server';

// Mock discussion posts linked to blog posts
const mockBlogDiscussions: { [key: string]: any[] } = {
  '1': [
    {
      _id: 'discussion_1_1',
      title: 'Discussion: The Ultimate Guide to Las Vegas Poker Rooms',
      content: 'Great article! I\'ve been to most of these rooms and can confirm the Bellagio is still the gold standard.',
      author: 'VegasRegular',
      createdAt: '2024-01-16T10:30:00Z',
      replies: 5,
      likes: 12,
      category: 'Blog Discussion',
      isBlogPost: false,
      blogPostId: '1',
      authorEmail: 'vegasregular@email.com',
      authorRank: 'High Roller'
    },
    {
      _id: 'discussion_1_2',
      title: 'Re: Aria vs Bellagio for cash games',
      content: 'I prefer Aria for the newer facilities, but Bellagio definitely has the better action in higher stakes.',
      author: 'CashGamePro',
      createdAt: '2024-01-16T14:15:00Z',
      replies: 3,
      likes: 8,
      category: 'Blog Discussion',
      isBlogPost: false,
      blogPostId: '1',
      authorEmail: 'cashgamepro@email.com',
      authorRank: 'Pro'
    }
  ],
  '2': [
    {
      _id: 'discussion_2_1',
      title: 'Discussion: Tournament Strategy: Playing Deep Stack Events',
      content: 'This strategy guide is spot on. The key is patience in the early levels when you have so many chips.',
      author: 'TournamentGrinder',
      createdAt: '2024-01-11T09:20:00Z',
      replies: 7,
      likes: 15,
      category: 'Blog Discussion',
      isBlogPost: false,
      blogPostId: '2',
      authorEmail: 'tournamentgrinder@email.com',
      authorRank: 'Tournament Pro'
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { blogPostId: string } }
) {
  try {
    const { blogPostId } = params;

    if (!blogPostId) {
      return NextResponse.json(
        { error: 'blogPostId is required' },
        { status: 400 }
      );
    }

    // Get discussion posts for this blog post
    const discussionPosts = mockBlogDiscussions[blogPostId] || [];

    return NextResponse.json(discussionPosts);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { blogPostId, title } = await request.json();

    if (!blogPostId || !title) {
      return NextResponse.json(
        { error: 'blogPostId and title are required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would create a new post in the database
    // For now, we'll return a mock response
    const newDiscussionPost = {
      _id: `discussion_${blogPostId}_${Date.now()}`,
      title: `Discussion: ${title}`,
      content: `Join the discussion about this blog post: ${title}`,
      author: 'System',
      createdAt: new Date().toISOString(),
      replies: 0,
      likes: 0,
      category: 'Blog Discussion',
      isBlogPost: false,
      blogPostId: blogPostId,
      authorEmail: 'system@felt2felt.com',
      authorRank: 'Admin'
    };

    return NextResponse.json({
      success: true,
      data: newDiscussionPost
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
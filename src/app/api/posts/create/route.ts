import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { title, content, category, city } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, content, and category are required'
        },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (title.length < 5 || title.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title must be between 5 and 100 characters'
        },
        { status: 400 }
      );
    }

    if (content.length < 10 || content.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Content must be between 10 and 2000 characters'
        },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = [
      'Trip Planning',
      'Tournament Discussion',
      'Poker Strategy',
      'Venue Reviews',
      'General Discussion',
      'Looking for Players',
      'Travel Tips',
      'Accommodation',
      'Local Recommendations'
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid category selected'
        },
        { status: 400 }
      );
    }

    // For now, simulate creating a post with mock data
    // In a real app, this would save to the database
    const placeholderUser = {
      name: 'Community Member',
      email: 'community@felt2felt.com'
    };

    // Create the mock post response
    const newPost = {
      _id: `post_${Date.now()}`, // Generate a unique ID
      title: title.trim(),
      content: content.trim(),
      author: placeholderUser.name,
      authorEmail: placeholderUser.email,
      authorRank: 'New Hand',
      city: city?.trim() || undefined,
      category: category,
      createdAt: new Date().toISOString(),
      replies: 0,
      likes: 0,
      isBlogPost: false
    };

    return NextResponse.json(
      {
        success: true,
        data: newPost,
        message: 'Post created successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating post:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to create a new post.' 
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to create a new post.' 
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to create a new post.' 
    },
    { status: 405 }
  );
}
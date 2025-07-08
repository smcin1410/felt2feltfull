import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { getRandomImage } from '@/lib/image-utils';

export async function GET(_request: Request) {
  await dbConnect();

  try {
    // Finds documents specifically marked as blog posts
    const posts = await Post.find({ isBlogPost: true }).sort({ createdAt: -1 }).lean();

    const postsWithImages = posts.map(post => ({
      ...post,
      image: getRandomImage(),
    }));

    return NextResponse.json({ success: true, data: postsWithImages });
  } catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  
  return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
}
}
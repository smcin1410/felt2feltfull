import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { getRandomImage } from '@/lib/image-utils';

export async function GET(request: Request) { // Add the ': Request' type
  await dbConnect();

  try {
    // Finds documents where isBlogPost is not true (i.e., forum posts)
    const posts = await Post.find({ isBlogPost: { $ne: true } }).sort({ createdAt: -1 }).lean();

    const postsWithImages = posts.map(post => ({
      ...post,
      image: getRandomImage(),
    }));

    return NextResponse.json({ success: true, data: postsWithImages });
  } catch (error) {
    // It's good practice to type the error as 'any' or 'unknown' in a catch block
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
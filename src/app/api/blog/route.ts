// src/app/api/blog/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("felt2felt"); // Replace with your database name

    // Note: Ensure your blog posts have a 'createdAt' field for sorting.
    const posts = await db
      .collection('posts')
      .find({})
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(5)
      .toArray();

    return NextResponse.json(posts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error fetching blog posts' }, { status: 500 });
  }
}

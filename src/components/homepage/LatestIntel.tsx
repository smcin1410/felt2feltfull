// src/components/homepage/LatestIntel.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Note: Ensure your MongoDB 'posts' collection includes these fields.
interface Post {
  _id: string;
  title: string;
  slug: string; // e.g., "that-little-card-is-your-biggest-comp"
  excerpt: string;
  imageUrl: string;
}

const LatestIntel = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const res = await fetch('/api/blog');
        if (!res.ok) throw new Error('Failed to fetch post');
        const posts = await res.json();
        if (posts.length > 0) setPost(posts[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchLatestPost();
  }, []);

  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400" style={{ textShadow: '0 0 8px #22d3ee' }}>
        Latest Intel from the Blog
      </h2>
      <div className="bg-gray-800 rounded-lg p-1 border border-gray-700 max-w-4xl mx-auto">
        {loading && <div className="min-h-[200px] flex items-center justify-center"><p>Loading latest intel...</p></div>}
        {error && <div className="min-h-[200px] flex items-center justify-center"><p className="text-red-400">Error: {error}</p></div>}
        {post && (
          <Link href={`/blog/${post.slug}`} className="block hover:opacity-90 transition-opacity">
            <div className="grid md:grid-cols-2 gap-0 items-center">
                <div className="relative h-80 md:h-full rounded-l-lg overflow-hidden">
                    <Image 
                        src={post.imageUrl || '/images/default-blog.jpg'}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="p-8">
                <h3 className="text-2xl font-bold">{post.title}</h3>
                <p className="mt-2 text-gray-300">{post.excerpt}</p>
                <span className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">
                    Read More...
                </span>
                </div>
            </div>
          </Link>
        )}
        {!loading && !post && <div className="min-h-[200px] flex items-center justify-center"><p>No blog posts found.</p></div>}
      </div>
    </section>
  );
};
export default LatestIntel;

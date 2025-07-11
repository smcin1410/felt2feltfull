'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string; // The API sends 'image'
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

        // **FIX 1: Destructure 'data' which is an array of posts**
        const { data: posts } = await res.json();
        if (posts && posts.length > 0) setPost(posts[0]);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchLatestPost();
  }, []);

  return (
    <section className="py-8">
      <h2 className="blog-section-title neon-glow text-3xl md:text-4xl font-bold text-center mb-8">
        Latest Intel from the Blog
      </h2>
      <div className="blog-featured-post max-w-3xl mx-auto">
        {loading && (
          <div className="blog-loading text-center p-8">
            <p className="text-gray-300">Loading latest intel...</p>
          </div>
        )}
        {error && (
          <div className="blog-error text-center p-6 frosted-glass neon-card border border-accent-hotpink">
            <p className="text-accent-hotpink font-semibold">Error: {error}</p>
          </div>
        )}
        {post && (
          <Link href={`/blog/${post.slug || post._id}`} className="blog-post-link">
            <div className="blog-post-card frosted-glass neon-card flex flex-col md:flex-row overflow-hidden">
              <div className="blog-post-image relative w-full md:w-1/2 h-64 md:h-auto">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="blog-post-content p-6 flex-1 flex flex-col justify-center">
                <h3 className="blog-post-title neon-glow text-2xl font-bold mb-2">{post.title}</h3>
                <p className="blog-post-excerpt text-gray-300 mb-4">{post.excerpt}</p>
                <span className="blog-read-more neon-btn px-4 py-2 self-start">Read More →</span>
              </div>
            </div>
          </Link>
        )}
        {!loading && !post && (
          <div className="blog-no-posts text-center p-8">
            <p className="text-gray-400">No blog posts found.</p>
          </div>
        )}
      </div>
    </section>
  );
};
export default LatestIntel;
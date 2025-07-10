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
    <section>
      <h2 className="blog-section-title">
        Latest Intel from the Blog
      </h2>
      <div className="blog-featured-post">
        {loading && (
          <div className="blog-loading">
            <p>Loading latest intel...</p>
          </div>
        )}
        {error && (
          <div className="blog-error">
            <p>Error: {error}</p>
          </div>
        )}
        {post && (
          <Link href={`/blog/${post.slug || post._id}`} className="blog-post-link">
            <div className="blog-post-card">
              <div className="blog-post-image">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="blog-post-content">
                <h3 className="blog-post-title">{post.title}</h3>
                <p className="blog-post-excerpt">{post.excerpt}</p>
                <span className="blog-read-more">
                  Read More →
                </span>
              </div>
            </div>
          </Link>
        )}
        {!loading && !post && (
          <div className="blog-no-posts">
            <p>No blog posts found.</p>
          </div>
        )}
      </div>
    </section>
  );
};
export default LatestIntel;
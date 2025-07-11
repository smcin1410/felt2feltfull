'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/lib/types';

interface BlogPreviewListProps {
  onBlogClick: (blogPost: BlogPost) => void;
}

export default function BlogPreviewList({ onBlogClick }: BlogPreviewListProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const result = await response.json();
        setBlogPosts(result.data || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="blog-preview-loading">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-700/30 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-preview-error">
        <p className="text-red-400 text-sm">Error loading blog posts: {error}</p>
      </div>
    );
  }

  return (
    <div className="blog-preview-list">
      <h2 className="text-xl font-bold text-cyan-400 mb-4 font-poppins">Latest Articles</h2>
      <div className="space-y-4">
        {blogPosts.map((post) => (
          <div
            key={post._id}
            onClick={() => onBlogClick(post)}
            className="blog-preview-card cursor-pointer group"
          >
            {post.image && (
              <div className="blog-preview-image">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-32 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            )}
            <div className="blog-preview-content p-4">
              <h3 className="blog-preview-title text-white font-semibold text-sm mb-2 group-hover:text-cyan-400 transition-colors">
                {post.title}
              </h3>
              <p className="blog-preview-excerpt text-gray-400 text-xs mb-2 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="blog-preview-meta flex justify-between items-center text-xs text-gray-500">
                <span>{post.author}</span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="blog-preview-tags flex flex-wrap gap-1 mt-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-cyan-400/20 text-cyan-400 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
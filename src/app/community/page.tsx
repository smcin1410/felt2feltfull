'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FaPlus } from 'react-icons/fa';

// Define the structure of a Post object
interface Post {
  _id: string;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  replies: number;
  likes: number;
  category: string;
  isBlogPost: boolean;
}


export default function CommunityPage() {
  // State for posts, filters, and UI status
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Fetch community posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
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

    fetchPosts();
  }, []);

  // Derive unique categories for the filter dropdown from the posts
  const categories = Array.from(new Set(posts.map(post => post.category))).sort();

  // Filter posts based on search query and selected category
  const filteredPosts = posts.filter(post => {
    const searchMatch = searchQuery.toLowerCase() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    const categoryMatch = selectedCity === '' || post.category === selectedCity;

    return searchMatch && categoryMatch;
  });

  return (
    <>
      <Head>
        <title>Community Pot - Felt2Felt</title>
        <meta name="description" content="Join the Felt2Felt community conversation." />
      </Head>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-5xl font-orbitron font-bold mb-4 text-center neon-glow">THE COMMUNITY POT</h1>
          <p className="text-center text-gray-300 mb-12 text-lg">Your hub for poker discussions, questions, and trip planning</p>

          {/* Filter and Action Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 p-6 card-style items-center">
            <div className="flex-grow w-full md:w-auto">
              <input
                type="text"
                placeholder="Search posts by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar w-full"
              />
            </div>
            <div className="w-full md:w-auto md:min-w-[200px]">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="filter-btn w-full"
              >
                <option value="">Filter by Category</option>
                {categories.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <button className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
              <FaPlus />
              Create New Post
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-neon mx-auto mb-6"></div>
              <p className="text-text-secondary text-xl">Loading posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-md mx-auto">
                <p className="text-red-400 font-semibold text-lg">Error: {error}</p>
              </div>
            </div>
          )}

          {/* Posts Display */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <div key={post._id} className="card-style p-8 flex flex-col gap-6 hover:border-cyan-400/50 transition-all duration-300">
                    <div>
                      <p className="font-bold text-cyan-400 text-lg">{post.author}</p>
                      <h2 className="text-xl font-semibold mt-2 text-white">{post.title}</h2>
                      <p className="text-sm text-gray-400 mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-gray-300 flex-grow leading-relaxed">{post.content.substring(0, 150)}...</p>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span className="bg-gray-700/50 text-cyan-400 px-3 py-1 rounded-full border border-gray-600/30">{post.category}</span>
                      <div className="flex gap-4">
                        <span>👍 {post.likes}</span>
                        <span>💬 {post.replies}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-300 text-xl">No posts match your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
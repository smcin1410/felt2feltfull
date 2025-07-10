'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FaPlus } from 'react-icons/fa';
import { Post, PostFilters as FilterType, CreatePostForm } from '@/lib/types';
import CreatePostModal from '@/components/community/CreatePostModal';


export default function CommunityPage() {
  // State for posts, filters, and UI status
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Enhanced filter state
  const [filters, setFilters] = useState<FilterType>({
    searchQuery: '',
    selectedCategory: '',
    selectedAuthor: undefined,
    dateRange: undefined,
    sortBy: 'newest'
  });

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

  // Enhanced filtering logic
  const filteredPosts = posts.filter(post => {
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.selectedCategory && post.category !== filters.selectedCategory) {
      return false;
    }

    // Author filter
    if (filters.selectedAuthor && post.author !== filters.selectedAuthor) {
      return false;
    }

    // Date range filter (if implemented)
    if (filters.dateRange) {
      const postDate = new Date(post.createdAt);
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        if (postDate < startDate) return false;
      }
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        if (postDate > endDate) return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // Sort posts based on selected criteria
    switch (filters.sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'mostLiked':
        return b.likes - a.likes;
      case 'mostReplies':
        return b.replies - a.replies;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Derive unique categories and authors for filters
  const categories = Array.from(new Set(posts.map(post => post.category))).sort();
  const authors = Array.from(new Set(posts.map(post => post.author))).sort();

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterType, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle post creation
  const handleCreatePost = async (postData: CreatePostForm) => {
    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create post');
      }

      if (result.success && result.data) {
        // Add the new post to the beginning of the posts array
        setPosts(prevPosts => [result.data, ...prevPosts]);
        setIsCreateModalOpen(false);
        
        // Show success feedback (you could add a toast notification here)
        console.log('Post created successfully:', result.data);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      // Handle error (you could show an error toast here)
      throw error; // Re-throw to let the modal handle it
    }
  };

  return (
    <>
      <Head>
        <title>Community Pot - Felt2Felt</title>
        <meta name="description" content="Join the Felt2Felt community conversation." />
      </Head>
      <main className="community-page">
        <div className="community-page-container">
          <div className="community-header">
            <h1 className="community-page-title">THE COMMUNITY POT</h1>
            <p className="community-page-subtitle">Your hub for poker discussions, questions, and trip planning</p>
          </div>

          {/* Enhanced Filter and Action Bar */}
          <div className="community-filters-section">
            {/* Main Filter Row */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search posts by title, content, or author..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  className="search-bar w-full"
                />
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="new-post-btn flex items-center justify-center gap-2 px-4 md:px-6 text-sm md:text-base"
              >
                <FaPlus />
                <span className="hidden sm:inline">Create New Post</span>
                <span className="sm:hidden">New Post</span>
              </button>
            </div>

            {/* Secondary Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <select
                value={filters.selectedCategory}
                onChange={(e) => handleFilterChange('selectedCategory', e.target.value)}
                className="filter-btn"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={filters.selectedAuthor || ''}
                onChange={(e) => handleFilterChange('selectedAuthor', e.target.value || undefined)}
                className="filter-btn"
              >
                <option value="">All Authors</option>
                {authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterType['sortBy'])}
                className="filter-btn"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostLiked">Most Liked</option>
                <option value="mostReplies">Most Replies</option>
              </select>

              <div className="text-xs md:text-sm text-gray-400 flex items-center justify-center bg-gray-700/30 rounded-lg px-2 md:px-3 py-2 border border-gray-600/30 col-span-2 md:col-span-1">
                {filteredPosts.length} of {posts.length} posts
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="community-loading">
              <div className="community-loading-spinner"></div>
              <p className="community-loading-text">Loading posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="community-error">
              <div className="community-error-card">
                <p className="community-error-text">Error: {error}</p>
              </div>
            </div>
          )}

          {/* Posts Display */}
          {!loading && !error && (
            <div className="community-posts-grid">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <div key={post._id} className="community-post-card">
                    <div className="community-post-header">
                      <p className="community-post-author">{post.author}</p>
                      <h2 className="community-post-title">{post.title}</h2>
                      <p className="community-post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="community-post-content">{post.content.substring(0, 150)}...</p>
                    <div className="community-post-footer">
                      <span className="community-post-category">{post.category}</span>
                      <div className="community-post-stats">
                        <span>👍 {post.likes}</span>
                        <span>💬 {post.replies}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : posts.length === 0 ? (
                <div className="community-empty-state">
                  <div className="community-empty-card">
                    <h3 className="community-empty-title">🎰 The Conversation Starts Here!</h3>
                    <p className="community-empty-text">
                      Be the first to share your poker stories, ask questions, or find travel buddies for your next Vegas adventure.
                    </p>
                    <div className="community-empty-features">
                      <p className="community-empty-feature">💬 Share your biggest wins & bad beats</p>
                      <p className="community-empty-feature">🤝 Find poker travel companions</p>
                      <p className="community-empty-feature">🎯 Get insider tips from pros</p>
                    </div>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="community-start-btn"
                    >
                      <FaPlus />
                      Start the Conversation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="community-no-results">
                  <div className="community-no-results-card">
                    <p className="community-no-results-title">No posts match your criteria.</p>
                    <p className="community-no-results-text">Try adjusting your filters or search terms.</p>
                    <button
                      onClick={() => setFilters({
                        searchQuery: '',
                        selectedCategory: '',
                        selectedAuthor: undefined,
                        dateRange: undefined,
                        sortBy: 'newest'
                      })}
                      className="community-clear-all-btn"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Create Post Modal */}
          <CreatePostModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreatePost}
          />
        </div>
      </main>
    </>
  );
}
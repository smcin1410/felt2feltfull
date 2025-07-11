'use client';

import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Post, PostFilters as FilterType, CreatePostForm } from '@/lib/types';
import CreatePostModal from '@/components/community/CreatePostModal';

interface CommunityForumProps {
  blogPostId?: string;
  className?: string;
}

export default function CommunityForum({ blogPostId, className = '' }: CommunityForumProps) {
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

  // Fetch posts based on whether we're showing general posts or blog-specific discussion
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let url = '/api/posts';
        
        if (blogPostId) {
          url = `/api/posts/by-blog/${blogPostId}`;
        }

        const response = await fetch(url);
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
  }, [blogPostId]);

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
      }
    } catch (error) {
      console.error('Error creating post:', error);
      throw error; // Re-throw to let the modal handle it
    }
  };

  return (
    <div className={`community-forum ${className}`}>
      {/* Header */}
      <div className="community-forum-header mb-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-2 font-poppins">
          {blogPostId ? 'Discussion Thread' : 'Community Forum'}
        </h2>
        {!blogPostId && (
          <p className="text-gray-400 text-sm">
            Share your poker stories, ask questions, and connect with fellow players
          </p>
        )}
      </div>

      {/* Filter and Action Bar */}
      <div className="community-forum-filters mb-6">
        {/* Main Filter Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search posts by title, content, or author..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>
          {!blogPostId && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-colors text-sm md:text-base shadow-[0_0_10px_rgba(34,211,238,0.3)] hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            >
              <FaPlus />
              <span className="hidden sm:inline">Create New Post</span>
              <span className="sm:hidden">New Post</span>
            </button>
          )}
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <select
            value={filters.selectedCategory}
            onChange={(e) => handleFilterChange('selectedCategory', e.target.value)}
            className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filters.selectedAuthor || ''}
            onChange={(e) => handleFilterChange('selectedAuthor', e.target.value || undefined)}
            className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
          >
            <option value="">All Authors</option>
            {authors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterType['sortBy'])}
            className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
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
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-gray-400">Loading posts...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}

      {/* Posts Display */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div key={post._id} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 hover:border-gray-600/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-gray-400 text-sm">{post.author}</p>
                    <h3 className="text-white font-semibold text-lg">{post.title}</h3>
                    <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{post.content.substring(0, 200)}...</p>
                <div className="flex justify-between items-center">
                  <span className="bg-cyan-400/20 text-cyan-400 px-3 py-1 rounded-full text-sm">
                    {post.category}
                  </span>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.replies}</span>
                  </div>
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {blogPostId ? '🗣️ Start the Discussion!' : '🎰 The Conversation Starts Here!'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {blogPostId 
                    ? 'Be the first to share your thoughts about this article.'
                    : 'Be the first to share your poker stories, ask questions, or find travel buddies for your next Vegas adventure.'
                  }
                </p>
                {!blogPostId && (
                  <div className="space-y-2 mb-6 text-gray-400">
                    <p>💬 Share your biggest wins & bad beats</p>
                    <p>🤝 Find poker travel companions</p>
                    <p>🎯 Get insider tips from pros</p>
                  </div>
                )}
                {!blogPostId && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(34,211,238,0.3)] hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                  >
                    <FaPlus />
                    Start the Conversation
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
                <p className="text-white font-semibold mb-2">No posts match your criteria.</p>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => setFilters({
                    searchQuery: '',
                    selectedCategory: '',
                    selectedAuthor: undefined,
                    dateRange: undefined,
                    sortBy: 'newest'
                  })}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Post Modal */}
      {!blogPostId && (
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
}
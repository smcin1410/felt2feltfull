'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

interface BlogCategory {
  id: string;
  name: string;
  count: number;
}

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to Tournament Poker Strategy',
    excerpt: 'Master the fundamentals of tournament poker with these essential strategies that will take your game to the next level.',
    content: 'Tournament poker requires a different approach than cash games...',
    author: 'Mike Chen',
    date: '2024-01-15',
    category: 'Strategy',
    image: '/images/blog/tournament-strategy.jpg',
    readTime: '8 min read'
  },
  {
    id: '2',
    title: 'Top 10 Poker Destinations for 2024',
    excerpt: 'Discover the most exciting poker destinations around the world, from Las Vegas to Macau and beyond.',
    content: 'The world of poker offers incredible destinations...',
    author: 'Sarah Johnson',
    date: '2024-01-12',
    category: 'Travel',
    image: '/images/blog/poker-destinations.jpg',
    readTime: '6 min read'
  },
  {
    id: '3',
    title: 'Bankroll Management: The Key to Long-Term Success',
    excerpt: 'Learn how to properly manage your poker bankroll to ensure you can weather the inevitable downswings.',
    content: 'Proper bankroll management is crucial for any serious poker player...',
    author: 'David Rodriguez',
    date: '2024-01-10',
    category: 'Strategy',
    image: '/images/blog/bankroll-management.jpg',
    readTime: '5 min read'
  },
  {
    id: '4',
    title: 'WSOP 2024: What to Expect This Summer',
    excerpt: 'Get ready for the biggest poker event of the year with our comprehensive guide to the World Series of Poker.',
    content: 'The World Series of Poker is approaching...',
    author: 'Lisa Park',
    date: '2024-01-08',
    category: 'News',
    image: '/images/blog/wsop-2024.jpg',
    readTime: '7 min read'
  },
  {
    id: '5',
    title: 'Online vs Live Poker: Pros and Cons',
    excerpt: 'Explore the differences between online and live poker to determine which format suits your playing style.',
    content: 'Both online and live poker have their advantages...',
    author: 'Tom Wilson',
    date: '2024-01-05',
    category: 'Strategy',
    image: '/images/blog/online-vs-live.jpg',
    readTime: '6 min read'
  },
  {
    id: '6',
    title: 'Building Your Home Game: Tips for Success',
    excerpt: 'Create the perfect home poker game with these essential tips for hosting and managing regular games.',
    content: 'Running a successful home game requires planning...',
    author: 'Jennifer Lee',
    date: '2024-01-03',
    category: 'Community',
    image: '/images/blog/home-game.jpg',
    readTime: '4 min read'
  }
];

const CATEGORIES: BlogCategory[] = [
  { id: 'all', name: 'All Posts', count: 6 },
  { id: 'strategy', name: 'Strategy', count: 3 },
  { id: 'travel', name: 'Travel', count: 1 },
  { id: 'news', name: 'News', count: 1 },
  { id: 'community', name: 'Community', count: 1 }
];

const RECENT_POSTS = SAMPLE_POSTS.slice(0, 5);

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(SAMPLE_POSTS);
      setFilteredPosts(SAMPLE_POSTS);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchTerm]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="blog-page">
        <div className="blog-page-container">
          <div className="blog-loading">
            <div className="blog-loading-spinner"></div>
            <p className="blog-loading-text">Loading latest poker insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="blog-page-container">
        {/* Header */}
        <div className="blog-header">
          <h1 className="blog-page-title">Latest Intel</h1>
          <p className="blog-page-subtitle">
            Stay ahead of the game with expert insights, strategies, and the latest poker news
          </p>
        </div>

        {/* Filters */}
        <div className="blog-filters-section">
          <div className="blog-search-container">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bar"
            />
          </div>
          
          <div className="blog-categories">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {(selectedCategory !== 'all' || searchTerm) && (
          <div className="blog-results-summary">
            <p className="blog-results-count">
              Showing <span className="blog-count-highlight">{filteredPosts.length}</span> articles
              {selectedCategory !== 'all' && ` in ${CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
            <button onClick={clearFilters} className="blog-clear-filters">
              Clear all filters
            </button>
          </div>
        )}

        {/* Two-Column Layout */}
        <div className="blog-container">
          {/* Main Content Column */}
          <div className="main-column">
            {filteredPosts.length === 0 ? (
              <div className="blog-no-results">
                <div className="blog-no-results-card">
                  <h3 className="blog-no-results-title">No articles found</h3>
                  <p className="blog-no-results-text">
                    Try adjusting your search terms or browse all articles.
                  </p>
                  <button onClick={clearFilters} className="blog-clear-all-btn">
                    Show All Articles
                  </button>
                </div>
              </div>
            ) : (
              <div className="blog-posts-grid">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="blog-post-card">
                    <Link href={`/blog/${post.id}`} className="blog-post-link">
                      <div className="blog-post-image">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder-blog.jpg';
                          }}
                        />
                      </div>
                      <div className="blog-post-content">
                        <div className="blog-post-meta">
                          <span className="blog-post-category">{post.category}</span>
                          <span className="blog-post-read-time">{post.readTime}</span>
                        </div>
                        <h2 className="blog-post-title">{post.title}</h2>
                        <p className="blog-post-excerpt">{post.excerpt}</p>
                        <div className="blog-post-footer">
                          <span className="blog-post-author">By {post.author}</span>
                          <span className="blog-post-date">
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="sidebar-column">
            {/* Recent Posts */}
            <div className="blog-sidebar-section">
              <h3 className="sidebar-title">Recent Posts</h3>
              <div className="sidebar-post-list">
                {RECENT_POSTS.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`} className="sidebar-post-item">
                    <div className="sidebar-post-image">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder-blog.jpg';
                        }}
                      />
                    </div>
                    <div className="sidebar-post-content">
                      <h4 className="sidebar-post-title">{post.title}</h4>
                      <p className="sidebar-post-date">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="blog-sidebar-section">
              <h3 className="sidebar-title">Categories</h3>
              <div className="sidebar-categories">
                {CATEGORIES.filter(cat => cat.id !== 'all').map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`sidebar-category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  >
                    <span className="sidebar-category-name">{category.name}</span>
                    <span className="sidebar-category-count">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="blog-sidebar-section">
              <div className="newsletter-signup">
                <h3 className="newsletter-title">Stay Updated</h3>
                <p className="newsletter-description">
                  Get the latest poker strategies and tournament updates delivered to your inbox.
                </p>
                <form className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-btn">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
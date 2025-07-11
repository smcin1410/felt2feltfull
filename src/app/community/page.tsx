'use client';

import { useState } from 'react';
import Head from 'next/head';
import { BlogPost } from '@/lib/types';
import BlogPreviewList from '@/components/community/BlogPreviewList';
import CommunityForum from '@/components/community/CommunityForum';
import ExpandedBlogPostView from '@/components/community/ExpandedBlogPostView';

type ActiveTab = 'forum' | 'blog';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('forum');
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [discussionBlogId, setDiscussionBlogId] = useState<string | null>(null);

  const handleBlogClick = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost);
  };

  const handleCloseBlogPost = () => {
    setSelectedBlogPost(null);
  };

  const handleDiscussion = (blogPostId: string) => {
    setDiscussionBlogId(blogPostId);
    setActiveTab('forum');
    setSelectedBlogPost(null);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'forum') {
      setDiscussionBlogId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Community Pot - Felt2Felt</title>
        <meta name="description" content="Join the Felt2Felt community conversation and read the latest poker articles." />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins neon-glow mb-4">
              THE COMMUNITY POT
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Your hub for poker discussions, expert articles, and community insights
            </p>
          </div>

          {/* Neon/Cyberpunk frosted glass card for main content */}
          <div className="hidden md:grid md:grid-cols-12 gap-8 frosted-glass neon-card">
            {/* Left Column - Blog Preview List (30-40%) */}
            <div className="md:col-span-4 lg:col-span-4">
              <div className="sticky top-8">
                <BlogPreviewList onBlogClick={handleBlogClick} />
              </div>
            </div>

            {/* Right Column - Community Forum (60-70%) */}
            <div className="md:col-span-8 lg:col-span-8">
              <CommunityForum 
                blogPostId={discussionBlogId || undefined}
                className="h-full"
              />
            </div>
          </div>

          {/* Mobile Tabs (visible below md breakpoint) */}
          <div className="md:hidden mb-6">
            <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
              <button
                onClick={() => handleTabChange('forum')}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'forum'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 neon-btn'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                Community Forum
              </button>
              <button
                onClick={() => handleTabChange('blog')}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'blog'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 neon-btn'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                Blog
              </button>
            </div>
          </div>

          {/* Mobile Content (below md breakpoint) */}
          <div className="md:hidden frosted-glass neon-card">
            {activeTab === 'forum' && (
              <CommunityForum 
                blogPostId={discussionBlogId || undefined}
              />
            )}
            {activeTab === 'blog' && (
              <BlogPreviewList onBlogClick={handleBlogClick} />
            )}
          </div>
        </div>

        {/* Expanded Blog Post Overlay */}
        {selectedBlogPost && (
          <ExpandedBlogPostView
            blogPost={selectedBlogPost}
            onClose={handleCloseBlogPost}
            onDiscussion={handleDiscussion}
          />
        )}
      </main>
    </>
  );
}
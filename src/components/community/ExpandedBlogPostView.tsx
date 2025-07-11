'use client';

import { useState } from 'react';
import { FaTimes, FaComments } from 'react-icons/fa';
import { BlogPost } from '@/lib/types';

interface ExpandedBlogPostViewProps {
  blogPost: BlogPost;
  onClose: () => void;
  onDiscussion: (blogPostId: string) => void;
}

export default function ExpandedBlogPostView({ 
  blogPost, 
  onClose, 
  onDiscussion 
}: ExpandedBlogPostViewProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleDiscussion = () => {
    onDiscussion(blogPost._id);
    handleClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-lg shadow-2xl overflow-hidden transition-transform duration-200 ${
          isClosing ? 'scale-95' : 'scale-100'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 p-4 flex justify-between items-center">
          <div className="flex-1 pr-4">
            <h1 className="text-xl md:text-2xl font-bold text-white line-clamp-2">
              {blogPost.title}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span>By {blogPost.author}</span>
              <span>•</span>
              <span>{new Date(blogPost.publishedAt).toLocaleDateString()}</span>
              {blogPost.readTime && (
                <>
                  <span>•</span>
                  <span>{blogPost.readTime} min read</span>
                </>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscussion}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm"
            >
              <FaComments />
              <span className="hidden sm:inline">Discussion</span>
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
              aria-label="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Hero Image */}
          {blogPost.image && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={blogPost.image}
                alt={blogPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
            </div>
          )}

          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Excerpt */}
            {blogPost.excerpt && (
              <div className="mb-6">
                <p className="text-lg text-gray-300 leading-relaxed font-medium">
                  {blogPost.excerpt}
                </p>
              </div>
            )}

            {/* Tags */}
            {blogPost.tags && blogPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blogPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-gray-300 leading-relaxed space-y-4">
                {/* Split content into paragraphs for better formatting */}
                {blogPost.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  What do you think?
                </h3>
                <p className="text-gray-400 mb-4">
                  Join the discussion and share your thoughts with the community.
                </p>
                <button
                  onClick={handleDiscussion}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
                >
                  <FaComments />
                  Join Discussion
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-friendly bottom action bar */}
        <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 p-4 flex gap-3 md:hidden">
          <button
            onClick={handleDiscussion}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
          >
            <FaComments />
            Discussion
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
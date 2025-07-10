'use client';

import { useState } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import { CreatePostForm } from '@/lib/types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: CreatePostForm) => Promise<void>;
}

export default function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [formData, setFormData] = useState<CreatePostForm>({
    title: '',
    content: '',
    category: '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CreatePostForm>>({});

  // Predefined categories for the community
  const categories = [
    'Trip Planning',
    'Tournament Discussion',
    'Poker Strategy',
    'Venue Reviews',
    'General Discussion',
    'Looking for Players',
    'Travel Tips',
    'Accommodation',
    'Local Recommendations'
  ];

  const handleInputChange = (field: keyof CreatePostForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreatePostForm> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    } else if (formData.content.length > 2000) {
      newErrors.content = 'Content must be less than 2000 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on successful submission
      setFormData({
        title: '',
        content: '',
        category: '',
        city: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      // Handle error (could show a toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        content: '',
        category: '',
        city: ''
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-accent-neon font-orbitron">Create New Post</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-text-secondary hover:text-text-primary transition-colors duration-200 disabled:opacity-50"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter a descriptive title for your post..."
              className={`search-bar w-full ${errors.title ? 'border-red-500 focus:border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`filter-btn w-full ${errors.category ? 'border-red-500 focus:border-red-500' : ''}`}
              disabled={isSubmitting}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-400">{errors.category}</p>
            )}
          </div>

          {/* City Field (Optional) */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
              City (Optional)
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Which city is this post about? (optional)"
              className="search-bar w-full"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-400">
              Add a city if your post is location-specific
            </p>
          </div>

          {/* Content Field */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Post Content *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Share your thoughts, questions, or experiences with the community..."
              rows={8}
              className={`search-bar w-full resize-none ${errors.content ? 'border-red-500 focus:border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-400">{errors.content}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {formData.content.length}/2000 characters
            </p>
          </div>

          {/* Community Guidelines */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">Community Guidelines</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Be respectful and constructive in your discussions</li>
              <li>• Keep posts relevant to poker travel and tournaments</li>
              <li>• No spam, self-promotion, or off-topic content</li>
              <li>• Use appropriate categories for better discoverability</li>
            </ul>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800/50">
          <div className="text-sm text-gray-400">
            * Required fields
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.category}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating Post...
                </>
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
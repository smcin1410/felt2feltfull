'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FaPlus } from 'react-icons/fa';

// Define the structure of a Post object
interface Post {
  _id: string;
  author: string;
  avatar?: string; // Avatar is optional
  title: string;
  contentSnippet: string;
  city: string;
  tags: string[];
}

// Mock data for demonstration until the API is fully connected
// In a real scenario, this would come from your /api/posts endpoint
const mockPosts: Post[] = [
  { _id: '1', author: 'Sarah M.', title: 'Best cash games in Vegas?', contentSnippet: 'Heading to Vegas next month and looking for recommendations on the best cash games. Preferably $1/$3 or $2/$5 NLH...', city: 'Las Vegas', tags: ['#lasvegas', '#cashgame'] },
  { _id: '2', author: 'John D.', title: 'Anyone playing at the Borgata this weekend?', contentSnippet: 'I\'ll be in Atlantic City this weekend, planning to hit the tables at the Borgata. Anyone want to meet up?', city: 'Atlantic City', tags: ['#borgata', '#meetup'] },
  { _id: '3', author: 'Emily R.', title: 'Tips for a first-timer at a big tournament series?', contentSnippet: 'I just qualified for my first major tournament series and I\'m super nervous. Any advice for a newbie?', city: 'Online', tags: ['#tournament', '#advice'] },
  { _id: '4', author: 'Mike B.', title: 'Hollywood, FL action', contentSnippet: 'The poker scene in Hollywood, FL is underrated. Great action at the Seminole Hard Rock. Highly recommend.', city: 'Hollywood', tags: ['#florida', '#poker'] },
];


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
        // Replace with your actual API endpoint fetch
        // const response = await fetch('/api/posts');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch posts');
        // }
        // const data = await response.json();
        // setPosts(data);

        // Using mock data for now
        setPosts(mockPosts);

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

  // Derive unique cities for the filter dropdown from the posts
  const cities = Array.from(new Set(posts.map(post => post.city))).sort();

  // Filter posts based on search query and selected city
  const filteredPosts = posts.filter(post => {
    const searchMatch = searchQuery.toLowerCase() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const cityMatch = selectedCity === '' || post.city === selectedCity;

    return searchMatch && cityMatch;
  });

  return (
    <>
      <Head>
        <title>Community Pot - Felt2Felt</title>
        <meta name="description" content="Join the Felt2Felt community conversation." />
      </Head>
      <main className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-4xl font-bold mb-4 text-center text-accent-light">THE COMMUNITY POT</h1>
        <p className="text-center text-gray-400 mb-8">Your hub for poker discussions, questions, and trip planning.</p>

        {/* Filter and Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-gray-800 rounded-lg items-center">
          <div className="flex-grow w-full md:w-auto">
            <input
              type="text"
              placeholder="Search posts by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400 p-3 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-accent-hotpink"
            />
          </div>
          <div className="w-full md:w-auto md:min-w-[200px]">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-accent-hotpink"
            >
              <option value="">Filter by City</option>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <button className="w-full md:w-auto bg-accent-hotpink text-black font-bold py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-accent-hotpink">
            <FaPlus />
            Create New Post
          </button>
        </div>

        {/* Posts Display */}
        {loading ? (
          <div className="text-center text-accent-light">Loading posts...</div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-900/20 p-4 rounded-md"><strong>Error:</strong> {error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div key={post._id} className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col gap-4 hover:ring-2 hover:ring-accent-hotpink/50 transition-all duration-300">
                  <div>
                    <p className="font-bold text-accent-light">{post.author}</p>
                    <h2 className="text-xl font-semibold mt-1">{post.title}</h2>
                  </div>
                  <p className="text-gray-400 flex-grow">{post.contentSnippet}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="bg-gray-700 text-xs text-gray-300 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400">No posts match your criteria.</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}
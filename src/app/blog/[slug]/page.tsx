import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Define the structure of a full Post object
interface Post {
  _id: string;
  title: string;
  slug: string;
  author: string;
  publishedDate: string;
  imageUrl: string;
  content: string; // This would likely be HTML or Markdown content
}

// Define the structure for the sidebar posts
interface RecentPost {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
}

// --- Data Fetching Functions ---

// Function to get a single post by its slug
async function getPost(slug: string): Promise<Post> {
  // In a real app, you would fetch from your API:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${slug}`);
  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error('Failed to fetch post');
  // }
  // return res.json();
  
  // Using mock data for demonstration
  const mockPost: Post = {
    _id: '1',
    title: 'Mastering the River: Advanced Strategies for Final Betting',
    slug: 'mastering-the-river',
    author: 'Admin',
    publishedDate: '2024-10-26',
    imageUrl: '/placeholder-image.jpg', // Replace with a real image path
    content: `
      <p>The river is where legends are made and bankrolls are broken. Unlike previous streets, there are no more cards to come. It's a moment of pure information—or misinformation.</p>
      <p>Your strategy on the river should be a culmination of every decision you've made throughout the hand. The pot is at its largest, and so are the potential mistakes. Here, we'll break down advanced strategies to help you navigate this critical street with confidence.</p>
      <h3 class="text-xl font-bold mt-6 mb-2 text-accent-light">Value Betting vs. Bluffing</h3>
      <p>Every bet on the river can be categorized as either a value bet or a bluff. There is no middle ground. If you're betting for value, you must be confident that you'll be called by a worse hand more than 50% of the time. If you're bluffing, you're trying to make a better hand fold.</p>
    `
  };

  if (slug !== mockPost.slug) {
      notFound();
  }
  
  return mockPost;
}

// Function to get the list of recent posts for the sidebar
async function getRecentPosts(): Promise<RecentPost[]> {
  // In a real app, fetch from your API:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog?limit=5`);
  // return res.json();
  
  // Using mock data for demonstration
  return [
    { _id: '2', title: 'The Psychology of Poker Tells', slug: 'poker-tells', imageUrl: '/placeholder-image-small.jpg' },
    { _id: '3', title: 'Bankroll Management for Serious Players', slug: 'bankroll-management', imageUrl: '/placeholder-image-small.jpg' },
    { _id: '4', title: 'A Deep Dive into Game Theory Optimal (GTO) Play', slug: 'gto-play', imageUrl: '/placeholder-image-small.jpg' },
  ];
}


// The main page component
export default async function BlogPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  const recentPosts = await getRecentPosts();

  return (
    <main className="container mx-auto px-4 py-8 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        
        {/* Main Blog Post Content (Left Column) */}
        <article className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-accent-light mb-2">{post.title}</h1>
            <p className="text-gray-400">
              By {post.author} on {new Date(post.publishedDate).toLocaleDateString()}
            </p>
          </div>
          <div className="relative w-full h-96 mb-6">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
          {/* Use dangerouslySetInnerHTML to render HTML from your CMS/API */}
          <div
            className="prose prose-invert max-w-none prose-p:text-gray-300 prose-h3:text-accent-light"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        
        {/* All Intel Sidebar (Right Column) */}
        <aside>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg sticky top-24">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-accent-hotpink pb-2">ALL INTEL</h2>
            <ul className="space-y-4">
              {recentPosts.map(recentPost => (
                <li key={recentPost._id}>
                  <Link href={`/blog/${recentPost.slug}`} className="flex items-center gap-4 group">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image 
                        src={recentPost.imageUrl} 
                        alt={recentPost.title} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        className="rounded-md"
                      />
                    </div>
                    <span className="font-semibold group-hover:text-accent-hotpink transition-colors duration-200">
                      {recentPost.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
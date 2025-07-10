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
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blog/${slug}`);
    if (!res.ok) {
      throw new Error('Failed to fetch post');
    }
    const posts = await res.json();
    const post = posts.find((p: { slug: string }) => p.slug === slug);
    if (!post) {
      notFound();
    }
    return post;
  } catch {
    // Fallback to mock data if API fails
    const mockPost: Post = {
      _id: '1',
      title: 'Mastering the River: Advanced Strategies for Final Betting',
      slug: 'mastering-the-river',
      author: 'Admin',
      publishedDate: '2024-10-26',
      imageUrl: '/placeholder-image.jpg',
      content: `
        <p>The river is where legends are made and bankrolls are broken. Unlike previous streets, there are no more cards to come. It's a moment of pure information—or misinformation.</p>
        <p>Your strategy on the river should be a culmination of every decision you've made throughout the hand. The pot is at its largest, and so are the potential mistakes. Here, we'll break down advanced strategies to help you navigate this critical street with confidence.</p>
        <h3 class="text-xl font-bold mt-6 mb-2 text-cyan-400">Value Betting vs. Bluffing</h3>
        <p>Every bet on the river can be categorized as either a value bet or a bluff. There is no middle ground. If you're betting for value, you must be confident that you'll be called by a worse hand more than 50% of the time. If you're bluffing, you're trying to make a better hand fold.</p>
      `
    };

    if (slug !== mockPost.slug) {
      notFound();
    }
    
    return mockPost;
  }
}

// Function to get the list of recent posts for the sidebar
async function getRecentPosts(): Promise<RecentPost[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blog`);
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts = await res.json();
    return posts.slice(0, 5).map((post: { _id: string; title: string; slug: string; imageUrl?: string }) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      imageUrl: post.imageUrl || '/placeholder-image-small.jpg'
    }));
  } catch {
    // Fallback to mock data if API fails
    return [
      { _id: '2', title: 'The Psychology of Poker Tells', slug: 'poker-tells', imageUrl: '/placeholder-image-small.jpg' },
      { _id: '3', title: 'Bankroll Management for Serious Players', slug: 'bankroll-management', imageUrl: '/placeholder-image-small.jpg' },
      { _id: '4', title: 'A Deep Dive into Game Theory Optimal (GTO) Play', slug: 'gto-play', imageUrl: '/placeholder-image-small.jpg' },
    ];
  }
}


// The main page component
export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const recentPosts = await getRecentPosts();

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="blog-container">
          
          {/* Main Blog Post Content (Left Column) */}
          <article className="main-column">
            <div className="mb-6">
              <h1 className="text-4xl font-poppins font-bold neon-glow mb-2">{post.title}</h1>
              <p className="text-gray-400 font-roboto">
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
              className="prose prose-invert max-w-none prose-p:text-gray-300 prose-h3:text-cyan-400 font-roboto"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
          
          {/* All Intel Sidebar (Right Column) */}
          <aside className="sidebar-column">
            <div className="card-style p-6 sticky top-24">
              <h2 className="sidebar-title text-2xl font-poppins font-bold mb-4 neon-glow-pink border-b-2 border-pink-500/30 pb-2">ALL INTEL</h2>
              <ul className="sidebar-post-list space-y-4">
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
                      <span className="font-semibold group-hover:text-pink-500 transition-colors duration-200 font-roboto">
                        {recentPost.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
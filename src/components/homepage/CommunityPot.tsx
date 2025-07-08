import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getPosts() {
  const res = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function CommunityPot() {
  const { data: posts } = await getPosts();

  return (
    <div className="bg-black text-white py-12 px-4 md:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">THE COMMUNITY POT</h2>
        <p className="mb-6">Share your stories, find travel partners, and get the real scoop from players on the felt.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.slice(0, 3).map((post: any) => (
            <Link href={`/community/${post._id}`} key={post._id}>
               <div className="group relative block w-full h-64 overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 p-4 flex flex-col justify-end">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Button variant="outline" asChild>
          <Link href="/community">Join The Conversation</Link>
        </Button>
      </div>
    </div>
  );
}
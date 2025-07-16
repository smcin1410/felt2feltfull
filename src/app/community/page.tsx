import PromoBox from "@/components/PromoBox";
import CommunitySearchAndFilter from "@/components/CommunitySearchAndFilter";
import ResultsArea from "@/components/ResultsArea";
import BlogPreviewList from "@/components/BlogPreviewList";
import { previews } from "@/components/BlogPreviewList";
import { Monoton } from "next/font/google";
const monoton = Monoton({ subsets: ["latin"], weight: "400", display: "swap" });

export default function CommunityPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 pt-0 pb-10 flex flex-col gap-6">
      <div className="relative">
        <PromoBox
          title={<span className={monoton.className}>THE COMMUNITY POT</span>}
          subtitle="Share your stories, find travel partners, and get the real scoop from players on the felt."
          backgroundImage="/stock-photos/vegas-blurred-traffic.jpeg"
        />
        <div className="absolute top-6 right-6 z-30">
          <button className="px-6 py-2 rounded bg-pink-600 text-white font-semibold text-base shadow hover:bg-pink-500 transition">
            Create New Post
          </button>
        </div>
      </div>
      {/* Mobile-only horizontal scroll of blog previews */}
      <div className="flex md:hidden overflow-x-auto gap-3 py-2 -mx-4 px-4">
        {previews.slice(0, 10).map((post: { id: number; image: string; title: string; excerpt: string }) => (
          <div key={post.id} className="min-w-[180px] max-w-[180px] bg-neutral-900 rounded-lg shadow flex flex-col items-center p-2 gap-2 cursor-pointer hover:bg-neutral-800 transition">
            <img src={post.image} alt={post.title} className="w-full h-20 object-cover rounded mb-1" />
            <h3 className="text-xs font-bold neon-text text-center leading-tight">{post.title}</h3>
            <p className="text-[10px] text-gray-400 text-center line-clamp-2">{post.excerpt}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Left: Blog Previews */}
        <aside className="hidden md:block w-full md:w-[15%] max-w-xs flex-shrink-0">
          <BlogPreviewList />
        </aside>
        {/* Right: Forum Area */}
        <section className="w-full md:w-[85%] flex-1 flex flex-col gap-6">
          <CommunitySearchAndFilter />
          <ResultsArea placeholder="Community posts will be displayed here." />
        </section>
      </div>
    </main>
  );
} 
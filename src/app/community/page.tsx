import PromoBox from "@/components/PromoBox";
import CommunitySearchAndFilter from "@/components/CommunitySearchAndFilter";
import ResultsArea from "@/components/ResultsArea";
import BlogPreviewList from "@/components/BlogPreviewList";

export default function CommunityPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 pt-0 pb-10 flex flex-col gap-6">
      <div className="relative">
        <PromoBox
          title={<span className="font-monoton">THE COMMUNITY POT</span>}
          subtitle="Share your stories, find travel partners, and get the real scoop from players on the felt."
          backgroundImage="/stock-photos/vegas-blurred-traffic.jpeg"
        />
        <div className="absolute top-6 right-6 z-30">
          <button className="px-6 py-2 rounded bg-pink-600 text-white font-semibold text-base shadow hover:bg-pink-500 transition">
            Create New Post
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Left: Blog Previews */}
        <aside className="w-full md:w-[15%] max-w-xs flex-shrink-0">
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
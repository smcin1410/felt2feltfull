import BlogMainContent from "@/components/BlogMainContent";
import BlogSidebar from "@/components/BlogSidebar";

export default function BlogPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">
      <BlogMainContent />
      <BlogSidebar />
    </main>
  );
} 
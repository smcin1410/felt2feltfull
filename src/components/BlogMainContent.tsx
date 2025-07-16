export default function BlogMainContent() {
  return (
    <article className="bg-neutral-900 rounded-xl shadow-lg flex flex-col gap-4 p-0 overflow-hidden">
      <div className="relative w-full h-64">
        <img
          src="/stock-photos/card-slot (1).jpeg"
          alt="Featured Blog Post"
          className="w-full h-64 object-cover object-center"
        />
        {/* Strong bottom fade for title readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black/95" />
        <div className="absolute bottom-0 left-0 w-full flex justify-center z-10 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold neon-text text-center drop-shadow-lg px-2">
            That Little Card is Your Biggest Comp
          </h1>
        </div>
      </div>
      <div className="text-gray-400 text-sm px-8 mt-2">By Felt2Felt Staff • June 15, 2025</div>
      <div className="prose prose-invert max-w-none text-gray-200 px-8 pb-8">
        <p>As a poker player, you know the house doesn&apos;t have an edge against your skill...</p>
        <p>It&apos;s Not About Losses, It&apos;s About Hours...</p>
      </div>
    </article>
  );
} 
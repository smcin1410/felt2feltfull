export const previews = [
  {
    id: 1,
    image: "/stock-photos/card-slot (1).jpeg",
    title: "That Little Card is Your Biggest Comp",
    excerpt: "As a poker player, you know the house doesn't have an edge against your skill..."
  },
  {
    id: 2,
    image: "/stock-photos/vegas-strip-excalibur.jpeg",
    title: "Cash in the Cage: A Guide to Bankroll Security",
    excerpt: "Learn how to keep your bankroll safe while on the road..."
  },
  {
    id: 3,
    image: "/stock-photos/london.jpeg",
    title: "Don't Tilt Your Body: Staying Healthy on the Road",
    excerpt: "Tips for staying healthy and focused during long poker trips..."
  },
  // ...add up to 10 previews
];

export default function BlogPreviewList() {
  return (
    <div className="h-[500px] md:h-[calc(100vh-200px)] overflow-y-auto flex flex-col gap-4 pr-2">
      {previews.map((post) => (
        <div key={post.id} className="bg-neutral-900 rounded-lg shadow flex flex-col items-center p-2 gap-2 cursor-pointer hover:bg-neutral-800 transition">
          <img src={post.image} alt={post.title} className="w-full h-20 object-cover rounded mb-1" />
          <h3 className="text-xs font-bold neon-text text-center leading-tight">{post.title}</h3>
          <p className="text-[10px] text-gray-400 text-center line-clamp-2">{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
} 
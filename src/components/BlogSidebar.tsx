export default function BlogSidebar() {
  return (
    <aside className="bg-neutral-900 rounded-xl shadow-lg p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold neon-text mb-3">All Intel</h2>
        <ul className="flex flex-col gap-2">
          <li>
            <a href="/blog/that-little-card" className="text-pink-400 hover:underline">That Little Card is Your Biggest Comp</a>
          </li>
          <li>
            <a href="/blog/cash-in-cage" className="text-pink-400 hover:underline">Cash in the Cage: A Guide to Bankroll Security</a>
          </li>
          <li>
            <a href="/blog/healthy-on-road" className="text-pink-400 hover:underline">Don&apos;t Tilt Your Body: Staying Healthy on the Road</a>
          </li>
        </ul>
      </div>
    </aside>
  );
} 
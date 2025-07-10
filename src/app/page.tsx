import UpcomingTournaments from '@/components/homepage/UpcomingTournaments';
import CommunityPot from '@/components/homepage/CommunityPot';
import FindNextFelt from '@/components/homepage/FindNextFelt';
import LatestIntel from '@/components/homepage/LatestIntel';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      {/* Hero Section */}
      <section className="text-center py-20 bg-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-orbitron text-5xl md:text-6xl font-bold mb-6 neon-glow">
            Your Personal Poker Concierge
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Don&apos;t just find a random trip. Design the perfect one. Tell us what you&apos;re looking for, and we&apos;ll point you to the right felt.
          </p>
          <button className="btn-primary text-lg">
            Find Your Action
          </button>
        </div>
      </section>

      {/* Content Sections */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 space-y-20 py-16">
        <UpcomingTournaments />
        <CommunityPot />
        <FindNextFelt />
        <LatestIntel />
      </div>
    </main>
  );
}
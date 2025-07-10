import UpcomingTournaments from '@/components/homepage/UpcomingTournaments';
import CommunityPot from '@/components/homepage/CommunityPot';
import FindNextFelt from '@/components/homepage/FindNextFelt';
import LatestIntel from '@/components/homepage/LatestIntel';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#121212]">
      {/* Hero Section - "Your Personal Poker Concierge" */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Personal Poker Concierge
          </h1>
          <p className="hero-subtitle">
            Don&apos;t just find a random trip. Design the perfect one. Tell us what you&apos;re looking for, and we&apos;ll point you to the right felt.
          </p>
          <button className="hero-cta-btn">
            Find Your Action
          </button>
        </div>
      </section>

      {/* Upcoming Tournaments Section */}
      <UpcomingTournaments />

      {/* Community Pot - Full Width Background Section */}
      <CommunityPot />

      {/* Find Your Next Felt Section */}
      <FindNextFelt />

      {/* Latest Intel Section */}
      <LatestIntel />
    </main>
  );
}
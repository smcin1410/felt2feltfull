// src/app/page.tsx
import Header from '@/components/homepage/Header';
import UpcomingTournaments from '@/components/homepage/UpcomingTournaments';
import CommunityPot from '@/components/homepage/CommunityPot';
import FindNextFelt from '@/components/homepage/FindNextFelt';
import LatestIntel from '@/components/homepage/LatestIntel';

export default function HomePage() {
  return (
    <main>
      {/* This div provides a container for the page content */}
      <div className="bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
          <UpcomingTournaments />
          <CommunityPot />
          <FindNextFelt />
          <LatestIntel />
        </div>
      </div>
    </main>
  );
}

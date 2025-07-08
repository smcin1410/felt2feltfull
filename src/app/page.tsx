import ImageWithFallback from '@/components/ImageWithFallback';
import UpcomingTournaments from '@/components/homepage/UpcomingTournaments';
import CommunityPot from '@/components/homepage/CommunityPot';
import FindNextFelt from '@/components/homepage/FindNextFelt';
import LatestIntel from '@/components/homepage/LatestIntel';
import Header from '@/components/homepage/Header';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black">
      <Header />
      <div className="w-full max-w-7xl px-4 md:px-8 space-y-16 my-16">
        <FindNextFelt />
        <UpcomingTournaments />
        <CommunityPot />
        <LatestIntel />
      </div>
    </main>
  );
}
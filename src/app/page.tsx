import UpcomingTournaments from '@/components/homepage/UpcomingTournaments';
import CommunityPot from '@/components/homepage/CommunityPot';
import FindNextFelt from '@/components/homepage/FindNextFelt';
import LatestIntel from '@/components/homepage/LatestIntel';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#121212] pt-16">
      {/* Hero Image */}
      <section className="relative h-[40vh] min-h-[280px] w-full flex items-center justify-center">
        <Image
          src="/stock-photos/southfloridanight.jpeg"
          alt="Hero Background"
          fill
          className="object-cover object-center z-0"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
      </section>

      {/* Concierge Box */}
      <section className="flex justify-center -mt-20 mb-12 relative z-20">
        <div className="bg-[#181A20]/90 border-2 border-accent-neon shadow-neon-cyan rounded-xl px-10 py-8 max-w-xl w-full text-center">
          <h1 className="neon-glow text-3xl md:text-4xl font-bold font-poppins mb-4">Your Personal Poker Concierge</h1>
          <p className="text-gray-300 mb-6">Don&apos;t just find a random trip. Design the perfect one. Tell us what you&apos;re looking for, and we&apos;ll point you to the right felt.</p>
          <button className="neon-btn text-lg px-8 py-3 mt-2">Find Your Action</button>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="mb-16">
        <h2 className="neon-glow text-2xl md:text-3xl font-bold text-center mb-8">Upcoming Tournaments</h2>
        <div className="flex flex-col items-center">
          <UpcomingTournaments />
        </div>
      </section>

      {/* Community Pot Banner */}
      <section className="relative w-full h-[220px] md:h-[280px] flex items-center justify-center mb-16">
        <Image
          src="/stock-photos/southfloridanight.jpeg"
          alt="Community Pot Banner"
          fill
          className="object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div className="relative z-20 w-full flex flex-col items-center justify-center text-center">
          <h2 className="neon-glow text-3xl md:text-4xl font-bold mb-4">THE COMMUNITY POT</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Share your stories, find travel partners, and get the real scoop from players on the felt.</p>
          <button className="neon-btn-pink text-lg px-8 py-3">Join The Conversation</button>
        </div>
      </section>

      {/* Find Your Next Felt Grid */}
      <section className="max-w-5xl mx-auto mb-16 px-4">
        <h2 className="neon-glow text-2xl md:text-3xl font-bold text-center mb-8">Find Your Next Felt</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Example cards, replace with dynamic data if needed */}
          {[
            { title: 'Las Vegas', image: '/stock-photos/vegassign.jpeg' },
            { title: 'South Florida', image: '/stock-photos/southfloridanight.jpeg' },
            { title: 'London', image: '/stock-photos/card.jpeg' },
          ].map((dest, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden border-2 border-accent-neon shadow-neon-cyan group h-56 flex items-end">
              <Image
                src={dest.image}
                alt={dest.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300 z-0"
              />
              <div className="absolute inset-0 bg-black/40 z-10" />
              <div className="relative z-20 w-full p-4 flex items-end justify-center">
                <h3 className="neon-glow text-xl font-bold text-center">{dest.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Intel from the Blog */}
      <section className="max-w-4xl mx-auto mb-20 px-4">
        <h2 className="neon-glow text-2xl md:text-3xl font-bold text-center mb-8">Latest Intel from the Blog</h2>
        <div className="flex flex-col md:flex-row items-center bg-[#181A20]/90 border-2 border-accent-neon shadow-neon-cyan rounded-xl overflow-hidden">
          {/* Blog image left */}
          <div className="relative w-full md:w-1/2 h-56 md:h-64">
            <Image
              src="/stock-photos/card.jpeg"
              alt="Blog Featured"
              fill
              className="object-cover object-center rounded-l-xl"
            />
          </div>
          {/* Blog content right */}
          <div className="flex-1 p-6 flex flex-col justify-center">
            <h3 className="neon-glow text-xl font-bold mb-2">The Ultimate Guide to Las Vegas Poker Rooms</h3>
            <p className="text-gray-300 mb-4">Discover the best poker rooms in Las Vegas, from the iconic Bellagio to the modern Aria. Learn about stakes, games, and what makes each room unique.</p>
            <a href="#" className="neon-btn px-4 py-2 self-start">Read More →</a>
          </div>
        </div>
      </section>
    </main>
  );
}
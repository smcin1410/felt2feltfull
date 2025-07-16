import Hero from "@/components/Hero";
import DynamicContent from "@/components/DynamicContent";
import PromoBanner from "@/components/PromoBanner";
import CardGrid from "@/components/CardGrid";
import FeaturedPost from "@/components/FeaturedPost";
import { Monoton } from "next/font/google";
const monoton = Monoton({ subsets: ["latin"], weight: "400", display: "swap" });

export default function Home() {
  return (
    <main className="flex flex-col gap-16 max-w-5xl mx-auto px-4 py-10">
      <Hero
        title="Your Personal Poker Concierge"
        subtitle="Don't just find a random trip. Design the perfect one. Tell us what you're looking for, and we'll point you to the right felt."
        cta={{ text: "Find Your Action", href: "/trip-designer" }}
      />
      <DynamicContent title="Upcoming Tournaments" placeholder="Loading the latest events..." />
      <PromoBanner
        title={<span className={monoton.className}>THE COMMUNITY POT</span>}
        subtitle="Share your stories, find travel partners, and get the real scoop from players on the felt."
        cta={{ text: "Join The Conversation", href: "/community" }}
        backgroundImage="/stock-photos/vegas-blurred-traffic.jpeg"
        glowCta={true}
      />
      <CardGrid
        title="Find Your Next Felt"
        cards={[
          { id: "las_vegas", image: "/stock-photos/vegas-strip-excalibur.jpeg", title: "Las Vegas", href: "/destinations/las-vegas" },
          { id: "south_florida", image: "/stock-photos/southfloridalights.jpeg", title: "South Florida", href: "/destinations/south-florida" },
          { id: "london", image: "/stock-photos/london.jpeg", title: "London", href: "/destinations/london" },
        ]}
      />
      <FeaturedPost
        title="Latest Intel from the Blog"
        post={{
          image: "/stock-photos/card-slot (1).jpeg",
          title: "That Little Card is Your Biggest Comp",
          excerpt: "As a poker player, you know the house doesn't have an edge against your skill. This often leads players to believe that the casino's loyalty programs aren't for them...",
          readMoreLink: "/blog/that-little-card"
        }}
      />
    </main>
  );
}

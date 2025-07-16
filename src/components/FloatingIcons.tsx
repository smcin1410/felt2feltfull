'use client';
import { Briefcase, ArrowUp } from "lucide-react";
import { useCallback } from "react";

export default function FloatingIcons() {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Itinerary Window */}
      <button
        className="fixed bottom-6 left-6 z-40 bg-neutral-900 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition group"
        title="View Your Itinerary"
        aria-label="View Your Itinerary"
      >
        <Briefcase size={28} />
      </button>
      {/* Back to Top */}
      <button
        className="fixed bottom-6 right-6 z-40 bg-neutral-900 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition group"
        title="Back to Top"
        aria-label="Back to Top"
        onClick={scrollToTop}
      >
        <ArrowUp size={28} />
      </button>
    </>
  );
} 
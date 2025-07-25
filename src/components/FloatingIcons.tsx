'use client';
import { Briefcase, ArrowUp } from "lucide-react";
import { useCallback, useState } from "react";
import PreFlopPlannerModal from "./PreFlopPlannerModal";

export default function FloatingIcons() {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Pre-Flop Planner Window */}
      <button
        className="fixed bottom-6 left-6 z-40 bg-neutral-900 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition group"
        title="Open Pre-Flop Planner"
        aria-label="Open Pre-Flop Planner"
        onClick={() => setPlannerOpen(true)}
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
      {/* Pre-Flop Planner Modal */}
      {plannerOpen && <PreFlopPlannerModal onClose={() => setPlannerOpen(false)} />}
    </>
  );
} 
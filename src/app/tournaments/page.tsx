import TournamentsSearchAndFilter from "@/components/TournamentsSearchAndFilter";
import ResultsArea from "@/components/ResultsArea";

export default function TournamentsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">
      <TournamentsSearchAndFilter />
      <ResultsArea placeholder="Tournament schedule will be displayed here." />
    </main>
  );
} 
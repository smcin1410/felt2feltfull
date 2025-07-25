"use client";

import TournamentsSearchAndFilter, { TournamentFilters } from "@/components/TournamentsSearchAndFilter";
import ResultsArea from "@/components/ResultsArea";
import { useEffect, useState } from "react";
import TournamentSeriesCard, { TournamentSeries } from "@/components/TournamentSeriesCard";
import { normalizeCountryName } from "@/lib/utils";

function guessUserCountry(): string | null {
  if (typeof window === 'undefined') return null;
  const lang = navigator.language || (navigator.languages && navigator.languages[0]);
  if (!lang) return null;
  // Examples: 'en-US', 'en-GB', 'fr-FR', 'es-ES', etc.
  const code = lang.split('-')[1] || lang.split('-')[0];
  if (!code) return null;
  // Try to map to normalized country name
  return normalizeCountryName(code);
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<TournamentSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TournamentFilters>({});

  useEffect(() => {
    setLoading(true);
    fetch("/api/tournaments")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tournaments");
        return res.json();
      })
      .then(setTournaments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Extract unique, normalized country options
  const countrySet = new Set<string>();
  tournaments.forEach(t => {
    const normalized = normalizeCountryName(t.country || "");
    if (normalized) countrySet.add(normalized);
  });
  let countryOptions = Array.from(countrySet).sort();
  // Move user's country to the top if present
  let userCountry: string | null = null;
  if (typeof window !== 'undefined') {
    userCountry = guessUserCountry();
    if (userCountry && countryOptions.includes(userCountry)) {
      countryOptions = [userCountry, ...countryOptions.filter(c => c !== userCountry)];
    }
  }

  // Filter tournaments by selected country for state/city options
  const filteredByCountry = filters.country
    ? tournaments.filter(t => normalizeCountryName(t.country || "") === filters.country)
    : tournaments;

  // Extract unique state and city options based on selected country and state
  const stateSet = new Set<string>();
  const citySet = new Set<string>();
  filteredByCountry.forEach(t => {
    if (t.state) stateSet.add(t.state.trim());
  });
  const stateOptions = Array.from(stateSet).sort();

  // Filter cities by selected state if present
  let filteredForCity = filteredByCountry;
  if (filters.state) {
    filteredForCity = filteredByCountry.filter(t => t.state && t.state.trim() === filters.state);
  }
  filteredForCity.forEach(t => {
    if (t.city) citySet.add(t.city.trim());
  });
  const cityOptions = Array.from(citySet).sort();

  // Filtering logic
  const filteredTournaments = tournaments.filter((t) => {
    // Date filter
    const startDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const endDate = filters.dateTo ? new Date(filters.dateTo) : null;
    const tStart = new Date(t.startDate);
    const tEnd = t.endDate ? new Date(t.endDate) : tStart;
    const matchesDate =
      (!startDate || tEnd >= startDate) &&
      (!endDate || tStart <= endDate);
    // Country filter (normalize both sides)
    const matchesCountry = !filters.country || normalizeCountryName(t.country || "") === normalizeCountryName(filters.country);
    // State filter
    const matchesState = !filters.state || (t.state && t.state.trim() === filters.state);
    // City filter
    const matchesCity = !filters.city || (t.city && t.city.trim() === filters.city);
    return matchesDate && matchesCountry && matchesState && matchesCity;
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">
      <h1 className="text-4xl md:text-5xl font-bold neon-text mb-2 text-center">Tournament Series Calendar</h1>
      <TournamentsSearchAndFilter
        filters={filters}
        onFiltersChange={setFilters}
        countryOptions={countryOptions}
        stateOptions={stateOptions}
        cityOptions={cityOptions}
      />
      <section className="bg-black/60 rounded-xl shadow-lg p-8 min-h-[120px]">
        {loading ? (
          <div className="text-gray-400 italic">Loading tournaments...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : filteredTournaments.length === 0 ? (
          <div className="text-gray-400 italic">No tournaments found.</div>
        ) : (
          <div>
            {filteredTournaments.map((t) => (
              <TournamentSeriesCard
                key={t.id}
                tournament={t}
                expanded={expandedId === t.id}
                onExpand={() => setExpandedId(expandedId === t.id ? null : t.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
} 
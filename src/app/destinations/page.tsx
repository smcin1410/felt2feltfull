"use client";

import React, { useEffect, useState, useMemo } from "react";
import DestinationCard, { Destination } from "@/components/DestinationCard";
import DestinationsSearchAndFilter, { DestinationFilters } from "@/components/DestinationsSearchAndFilter";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DestinationFilters>({});

  useEffect(() => {
    setLoading(true);
    fetch("/api/destinations")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch destinations");
        return res.json();
      })
      .then(setDestinations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Compute options for dropdowns based on current destinations and filters
  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    destinations.forEach(d => { if (d.country) set.add(d.country); });
    return Array.from(set).sort();
  }, [destinations]);
  const stateOptions = useMemo(() => {
    const set = new Set<string>();
    destinations.forEach(d => {
      if (
        (!filters.country || d.country === filters.country) &&
        d.state
      ) set.add(d.state);
    });
    return Array.from(set).sort();
  }, [destinations, filters.country]);
  const cityOptions = useMemo(() => {
    const set = new Set<string>();
    destinations.forEach(d => {
      if (
        (!filters.country || d.country === filters.country) &&
        (!filters.state || d.state === filters.state) &&
        d.city
      ) set.add(d.city);
    });
    return Array.from(set).sort();
  }, [destinations, filters.country, filters.state]);

  // Filter destinations based on filters and search
  const filteredDestinations = useMemo(() => {
    return destinations.filter(d => {
      if (filters.country && d.country !== filters.country) return false;
      if (filters.state && d.state !== filters.state) return false;
      if (filters.city && d.city !== filters.city) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const fields = [
          d.casinoName,
          d.city,
          d.state,
          d.country,
          d.region,
          d.addressLine1,
          d.addressLine2,
          d.postalCode,
          d.website,
          d.pokerRoomInfo?.overview,
          d.travelerInformation
        ];
        if (!fields.some(f => f && f.toLowerCase().includes(search))) return false;
      }
      return true;
    });
  }, [destinations, filters]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">
      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-bold neon-text mb-4 text-center">Destinations</h1>
      {/* Search/Filter Section */}
      <DestinationsSearchAndFilter
        filters={filters}
        onFiltersChange={setFilters}
        countryOptions={countryOptions}
        stateOptions={stateOptions}
        cityOptions={cityOptions}
      />
      {/* Results Area */}
      <section className="flex-1 min-h-[300px] bg-gray-900/80 rounded-xl flex flex-col items-center justify-center text-gray-400 text-xl shadow-inner">
        {loading ? (
          <span>Loading destinations...</span>
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : filteredDestinations.length === 0 ? (
          <span>No destinations found.</span>
        ) : (
          <div className="w-full">
            {filteredDestinations.map((d) => (
              <DestinationCard
                key={d.id}
                destination={d}
                expanded={expandedId === d.id}
                onExpand={() => setExpandedId(expandedId === d.id ? null : d.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
} 
import React from "react";

export type DestinationFilters = {
  search?: string;
  country?: string;
  state?: string;
  city?: string;
};

type DestinationsSearchAndFilterProps = {
  filters: DestinationFilters;
  onFiltersChange: (filters: DestinationFilters) => void;
  countryOptions: string[];
  stateOptions: string[];
  cityOptions: string[];
};

export default function DestinationsSearchAndFilter({
  filters,
  onFiltersChange,
  countryOptions,
  stateOptions,
  cityOptions,
}: DestinationsSearchAndFilterProps) {
  return (
    <section className="bg-neutral-900 rounded-xl shadow-lg p-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          className="w-full bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
          placeholder="Search by Casino, City, State, Country, Region..."
          value={filters.search || ""}
          onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
        />
        <select
          className="bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
          value={filters.country || ""}
          onChange={e => onFiltersChange({ ...filters, country: e.target.value, state: '', city: '' })}
        >
          <option value="">All Countries</option>
          {countryOptions.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <select
          className="bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
          value={filters.state || ""}
          onChange={e => onFiltersChange({ ...filters, state: e.target.value, city: '' })}
        >
          <option value="">All States/Provinces</option>
          {stateOptions.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <select
          className="bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
          value={filters.city || ""}
          onChange={e => onFiltersChange({ ...filters, city: e.target.value })}
        >
          <option value="">All Cities</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
    </section>
  );
} 
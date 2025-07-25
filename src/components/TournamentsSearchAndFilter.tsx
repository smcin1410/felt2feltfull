import { Filter } from "lucide-react";
import React from "react";

export type TournamentFilters = {
  dateFrom?: string;
  dateTo?: string;
  country?: string;
  state?: string;
  city?: string;
};

type TournamentsSearchAndFilterProps = {
  filters: TournamentFilters;
  onFiltersChange: (filters: TournamentFilters) => void;
  countryOptions: string[];
  stateOptions: string[];
  cityOptions: string[];
};

export default function TournamentsSearchAndFilter({
  filters,
  onFiltersChange,
  countryOptions,
  stateOptions,
  cityOptions,
}: TournamentsSearchAndFilterProps) {
  return (
    <section className="bg-neutral-900 rounded-xl shadow-lg p-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
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
          onChange={e => onFiltersChange({ ...filters, state: e.target.value })}
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
        <input
          type="date"
          className="bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
          value={filters.dateFrom || ""}
          onChange={e => onFiltersChange({ ...filters, dateFrom: e.target.value })}
          placeholder="From"
        />
        <input
          type="date"
          className="bg-gray-800/50 text-white rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
          value={filters.dateTo || ""}
          onChange={e => onFiltersChange({ ...filters, dateTo: e.target.value })}
          placeholder="To"
        />
      </div>
    </section>
  );
} 
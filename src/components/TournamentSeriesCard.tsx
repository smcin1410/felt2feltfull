import React, { useState } from "react";
import { usePreFlopPlanner } from "./PreFlopPlannerContext";

export type TournamentSeries = {
  id: string;
  name: string;
  location: string;
  venue: string;
  startDate: string;
  endDate?: string;
  buyIn?: number;
  prizePool?: number;
  description?: string;
  imageKey?: string;
  link?: string;
  city?: string;
  state?: string;
  country?: string;
  addressLine1?: string;
  addressLine2?: string;
  postalCode?: string;
  events?: Array<{
    id?: string;
    name: string;
    startDate: string;
    endDate?: string;
    buyIn?: number;
    prizePool?: number;
    description?: string;
  }>;
};

type TournamentSeriesCardProps = {
  tournament: TournamentSeries;
  expanded: boolean;
  onExpand: () => void;
};

const DEFAULT_IMAGE = "/stock-photos/night-vegas-sign.jpeg";

export default function TournamentSeriesCard({ tournament, expanded, onExpand }: TournamentSeriesCardProps) {
  const imageUrl = tournament.imageKey ? `/stock-photos/${tournament.imageKey}` : DEFAULT_IMAGE;
  const { addItem } = usePreFlopPlanner();

  // Prevent card expand when clicking the button
  const handleAddToPlanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: tournament.id,
      type: "tournament",
      name: tournament.name,
      details: tournament,
    });
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-lg bg-black/80 mb-6 transition-all duration-300 cursor-pointer group border border-neutral-800 ${expanded ? "ring-2 ring-pink-500 scale-[1.02]" : "hover:ring-2 hover:ring-pink-400 hover:scale-105"}`}
      onClick={onExpand}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
    >
      {/* Add 2 Planner button */}
      <button
        className="absolute top-3 right-3 z-30 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold px-3 py-1 rounded shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
        onClick={handleAddToPlanner}
        tabIndex={-1}
        aria-label="Add to Pre-Flop Planner"
      >
        Add 2 Planner
      </button>
      {/* Faded background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-all duration-300"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      {/* Gradient overlay for text contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/80 to-black/95 pointer-events-none" />
      <div className="relative z-20 p-6 flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold neon-text mb-1 drop-shadow-lg">{tournament.name}</h2>
        <div className="text-sm text-gray-300 mb-1">{tournament.venue} &mdash; {tournament.location}</div>
        <div className="text-xs text-gray-400 mb-2">
          {new Date(tournament.startDate).toLocaleDateString()} - {tournament.endDate ? new Date(tournament.endDate).toLocaleDateString() : "TBD"}
        </div>
        {/* Buy-in removed from collapsed view */}
        {expanded && (
          <div className="mt-4 animate-fade-in">
            {/* Venue and Address Details */}
            <div className="mb-2 text-gray-200 text-sm">
              <div><span className="font-semibold">Venue:</span> {tournament.venue}</div>
              {tournament.addressLine1 && <div><span className="font-semibold">Address:</span> {tournament.addressLine1}{tournament.addressLine2 ? `, ${tournament.addressLine2}` : ''}</div>}
              <div>
                {tournament.city && <span>{tournament.city}, </span>}
                {tournament.state && <span>{tournament.state}, </span>}
                {tournament.postalCode && <span>{tournament.postalCode}, </span>}
                {tournament.country && <span>{tournament.country}</span>}
              </div>
            </div>
            {tournament.description && (
              <div className="mb-2 text-gray-200 text-sm">{tournament.description}</div>
            )}
            {tournament.prizePool && (
              <div className="text-green-400 font-mono text-sm mb-2">Prize Pool: ${tournament.prizePool.toLocaleString()}</div>
            )}
            {tournament.events && tournament.events.length > 0 && (
              <div className="mt-2">
                <div className="font-semibold text-pink-300 mb-1">Events:</div>
                <ul className="pl-4 list-disc text-gray-200 text-sm">
                  {tournament.events.map((event, idx) => (
                    <li key={event.id || idx} className="mb-1">
                      <span className="font-bold text-white">{event.name}</span> &mdash; {event.startDate ? new Date(event.startDate).toLocaleDateString() : "TBD"}
                      {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                      {event.buyIn && <span className="ml-2 text-pink-400">Buy-in: ${event.buyIn.toLocaleString()}</span>}
                      {event.prizePool && <span className="ml-2 text-green-400">Prize: ${event.prizePool.toLocaleString()}</span>}
                      {event.description && <div className="text-xs text-gray-400 ml-2">{event.description}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tournament.link && (
              <a
                href={tournament.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 rounded bg-pink-600 text-white font-semibold text-sm shadow hover:bg-pink-500 transition"
              >
                Official Site
              </a>
            )}
          </div>
        )}
      </div>
      {/* Expand/collapse indicator */}
      <div className="absolute top-4 right-4 z-30">
        <span className={`inline-block w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-pink-400 shadow-lg transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>▼</span>
      </div>
    </div>
  );
} 
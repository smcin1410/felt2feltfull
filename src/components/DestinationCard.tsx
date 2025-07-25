import React, { useState } from "react";
import { usePreFlopPlanner } from "./PreFlopPlannerContext";

export type Destination = {
  id: string;
  casinoName: string;
  city: string;
  state?: string;
  country: string;
  addressLine1?: string;
  addressLine2?: string;
  region?: string;
  postalCode?: string;
  imageKey?: string;
  website?: string;
  pokerRoomInfo?: {
    overview?: string;
    numberOfTables?: number;
    operatingHours?: string;
    gamesOffered?: string[];
    tournaments?: {
      schedule?: string;
      majorSeries?: string;
    };
    promotions?: string;
    amenities?: string[];
  };
  travelerInformation?: string;
};

type DestinationCardProps = {
  destination: Destination;
  expanded: boolean;
  onExpand: () => void;
  adminControls?: React.ReactNode;
};

const DEFAULT_IMAGE = "/stock-photos/vegas-night.jpeg";

export default function DestinationCard({ destination, expanded, onExpand, adminControls }: DestinationCardProps) {
  const imageUrl = destination.imageKey ? `/stock-photos/${destination.imageKey}` : DEFAULT_IMAGE;
  const { addItem } = usePreFlopPlanner();

  // Prevent card expand when clicking the button
  const handleAddToPlanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: destination.id,
      type: "destination",
      name: destination.casinoName,
      details: destination,
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
        <h2 className="text-2xl md:text-3xl font-bold neon-text mb-1 drop-shadow-lg">{destination.casinoName}</h2>
        <div className="text-sm text-gray-300 mb-1">
          {destination.city}{destination.state ? ", " + destination.state : ""}{destination.country ? ", " + destination.country : ""}
        </div>
        {expanded && destination.website && (
          <a href={destination.website} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-400 underline mb-2">{destination.website}</a>
        )}
        {expanded && (
          <div className="mt-4 animate-fade-in">
            {/* Address and Region */}
            <div className="mb-2 text-gray-200 text-sm">
              {destination.addressLine1 && <div><span className="font-semibold">Address:</span> {destination.addressLine1}{destination.addressLine2 ? `, ${destination.addressLine2}` : ''}</div>}
              {destination.region && <div><span className="font-semibold">Region:</span> {destination.region}</div>}
              {destination.postalCode && <div><span className="font-semibold">Postal Code:</span> {destination.postalCode}</div>}
            </div>
            {/* Poker Room Info */}
            {destination.pokerRoomInfo && (
              <div className="mb-2 text-gray-200 text-sm">
                <div className="font-semibold text-pink-300 mb-1">Poker Room Info:</div>
                {destination.pokerRoomInfo.overview && <div className="mb-1">{destination.pokerRoomInfo.overview}</div>}
                {destination.pokerRoomInfo.numberOfTables && <div>Tables: {destination.pokerRoomInfo.numberOfTables}</div>}
                {destination.pokerRoomInfo.operatingHours && <div>Hours: {destination.pokerRoomInfo.operatingHours}</div>}
                {destination.pokerRoomInfo.gamesOffered && destination.pokerRoomInfo.gamesOffered.length > 0 && (
                  <div>
                    <span className="font-semibold">Games Offered:</span>
                    <ul className="pl-4 list-disc text-gray-300 text-xs">
                      {destination.pokerRoomInfo.gamesOffered.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                  </div>
                )}
                {destination.pokerRoomInfo.tournaments && (
                  <div className="mt-1">
                    <span className="font-semibold">Tournaments:</span>
                    <div className="text-xs">{destination.pokerRoomInfo.tournaments.schedule}</div>
                    <div className="text-xs">{destination.pokerRoomInfo.tournaments.majorSeries}</div>
                  </div>
                )}
                {destination.pokerRoomInfo.promotions && <div className="mt-1">Promotions: {destination.pokerRoomInfo.promotions}</div>}
                {destination.pokerRoomInfo.amenities && destination.pokerRoomInfo.amenities.length > 0 && (
                  <div className="mt-1">
                    <span className="font-semibold">Amenities:</span>
                    <ul className="pl-4 list-disc text-gray-300 text-xs">
                      {destination.pokerRoomInfo.amenities.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {/* Traveler Info */}
            {destination.travelerInformation && (
              <div className="mb-2 text-gray-200 text-sm">
                <div className="font-semibold text-pink-300 mb-1">Traveler Information:</div>
                <div>{destination.travelerInformation}</div>
              </div>
            )}
          </div>
        )}
        {adminControls && <div className="mt-2">{adminControls}</div>}
      </div>
    </div>
  );
} 
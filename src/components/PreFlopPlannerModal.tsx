import React, { useState } from "react";
import { usePreFlopPlanner } from "./PreFlopPlannerContext";
import { X, Trash2, Send } from "lucide-react";

export default function PreFlopPlannerModal({ onClose }: { onClose: () => void }) {
  const { items, removeItem, sendToTripDesigner } = usePreFlopPlanner();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-neutral-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-pink-400">The Pre-Flop Planner</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-300 hover:text-pink-400">
            <X size={28} />
          </button>
        </div>
        {/* List */}
        {items.length === 0 ? (
          <div className="text-gray-400 text-center py-12">No destinations or tournaments added yet.<br/>Use 'Add 2 Planner' on any card to get started!</div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
            {items.map(item => {
              const expanded = expandedId === item.id;
              if (item.type === "destination") {
                const d = item.details;
                return (
                  <div key={item.id} className={`relative rounded-lg bg-black/80 border border-pink-700 shadow p-4 transition-all duration-300 ${expanded ? "ring-2 ring-pink-400" : "hover:ring-2 hover:ring-pink-300"}`}>
                    {/* Remove button */}
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-pink-400"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove from planner"
                    >
                      <Trash2 size={20} />
                    </button>
                    {/* Send to Trip Designer button */}
                    <button
                      className="absolute top-2 right-10 text-gray-400 hover:text-green-400"
                      onClick={() => sendToTripDesigner(item.id)}
                      aria-label="Send to Trip Designer"
                    >
                      <Send size={20} />
                    </button>
                    {/* Card content */}
                    <div onClick={() => setExpandedId(expanded ? null : item.id)} className="cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-pink-200">{item.name}</span>
                        <span className="text-xs text-gray-400">{d.city}{d.state ? ", " + d.state : ""}{d.country ? ", " + d.country : ""}</span>
                      </div>
                      {expanded && (
                        <div className="mt-2 text-sm text-gray-200 animate-fade-in">
                          {d.website && <a href={d.website} target="_blank" rel="noopener noreferrer" className="text-pink-400 underline text-xs mb-2 block">{d.website}</a>}
                          {d.addressLine1 && <div><span className="font-semibold">Address:</span> {d.addressLine1}{d.addressLine2 ? `, ${d.addressLine2}` : ''}</div>}
                          {d.region && <div><span className="font-semibold">Region:</span> {d.region}</div>}
                          {d.postalCode && <div><span className="font-semibold">Postal Code:</span> {d.postalCode}</div>}
                          {d.pokerRoomInfo && (
                            <div className="mt-2">
                              <div className="font-semibold text-pink-300 mb-1">Poker Room Info:</div>
                              {d.pokerRoomInfo.overview && <div>{d.pokerRoomInfo.overview}</div>}
                              {d.pokerRoomInfo.numberOfTables && <div>Tables: {d.pokerRoomInfo.numberOfTables}</div>}
                              {d.pokerRoomInfo.operatingHours && <div>Hours: {d.pokerRoomInfo.operatingHours}</div>}
                              {d.pokerRoomInfo.gamesOffered && d.pokerRoomInfo.gamesOffered.length > 0 && (
                                <div>
                                  <span className="font-semibold">Games Offered:</span>
                                  <ul className="pl-4 list-disc text-gray-300 text-xs">
                                    {d.pokerRoomInfo.gamesOffered.map((g: string, i: number) => <li key={i}>{g}</li>)}
                                  </ul>
                                </div>
                              )}
                              {d.pokerRoomInfo.tournaments && (
                                <div className="mt-1">
                                  <span className="font-semibold">Tournaments:</span>
                                  <div className="text-xs">{d.pokerRoomInfo.tournaments.schedule}</div>
                                  <div className="text-xs">{d.pokerRoomInfo.tournaments.majorSeries}</div>
                                </div>
                              )}
                              {d.pokerRoomInfo.promotions && <div className="mt-1">Promotions: {d.pokerRoomInfo.promotions}</div>}
                              {d.pokerRoomInfo.amenities && d.pokerRoomInfo.amenities.length > 0 && (
                                <div className="mt-1">
                                  <span className="font-semibold">Amenities:</span>
                                  <ul className="pl-4 list-disc text-gray-300 text-xs">
                                    {d.pokerRoomInfo.amenities.map((a: string, i: number) => <li key={i}>{a}</li>)}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          {d.travelerInformation && (
                            <div className="mb-2 text-gray-200 text-sm">
                              <div className="font-semibold text-pink-300 mb-1">Traveler Information:</div>
                              <div>{d.travelerInformation}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else if (item.type === "tournament") {
                const t = item.details;
                return (
                  <div key={item.id} className={`relative rounded-lg bg-black/80 border border-pink-700 shadow p-4 transition-all duration-300 ${expanded ? "ring-2 ring-pink-400" : "hover:ring-2 hover:ring-pink-300"}`}>
                    {/* Remove button */}
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-pink-400"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove from planner"
                    >
                      <Trash2 size={20} />
                    </button>
                    {/* Send to Trip Designer button */}
                    <button
                      className="absolute top-2 right-10 text-gray-400 hover:text-green-400"
                      onClick={() => sendToTripDesigner(item.id)}
                      aria-label="Send to Trip Designer"
                    >
                      <Send size={20} />
                    </button>
                    {/* Card content */}
                    <div onClick={() => setExpandedId(expanded ? null : item.id)} className="cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-pink-200">{item.name}</span>
                        <span className="text-xs text-gray-400">{t.venue} — {t.location}</span>
                        <span className="text-xs text-gray-400">{new Date(t.startDate).toLocaleDateString()} - {t.endDate ? new Date(t.endDate).toLocaleDateString() : "TBD"}</span>
                      </div>
                      {expanded && (
                        <div className="mt-2 text-sm text-gray-200 animate-fade-in">
                          {t.link && <a href={t.link} target="_blank" rel="noopener noreferrer" className="text-pink-400 underline text-xs mb-2 block">{t.link}</a>}
                          {t.addressLine1 && <div><span className="font-semibold">Address:</span> {t.addressLine1}{t.addressLine2 ? `, ${t.addressLine2}` : ''}</div>}
                          <div>
                            {t.city && <span>{t.city}, </span>}
                            {t.state && <span>{t.state}, </span>}
                            {t.postalCode && <span>{t.postalCode}, </span>}
                            {t.country && <span>{t.country}</span>}
                          </div>
                          {t.description && <div className="mb-2 text-gray-200 text-sm">{t.description}</div>}
                          {t.prizePool && <div className="text-green-400 font-mono text-sm mb-2">Prize Pool: ${t.prizePool.toLocaleString()}</div>}
                          {t.events && t.events.length > 0 && (
                            <div className="mt-2">
                              <div className="font-semibold text-pink-300 mb-1">Events:</div>
                              <ul className="pl-4 list-disc text-gray-200 text-sm">
                                {t.events.map((event: any, idx: number) => (
                                  <li key={event.id || idx} className="mb-1">
                                    <span className="font-bold text-white">{event.name}</span> — {event.startDate ? new Date(event.startDate).toLocaleDateString() : "TBD"}
                                    {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                                    {event.buyIn && <span className="ml-2 text-pink-400">Buy-in: ${event.buyIn.toLocaleString()}</span>}
                                    {event.prizePool && <span className="ml-2 text-green-400">Prize: ${event.prizePool.toLocaleString()}</span>}
                                    {event.description && <div className="text-xs text-gray-400 ml-2">{event.description}</div>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
} 
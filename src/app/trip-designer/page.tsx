"use client";

import React, { useState } from "react";
import { UserCircleIcon, PlusIcon, CalendarIcon, MapIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import Timeline from "./Timeline";
import GroupChat from "./GroupChat";
import VotingSystem from "./VotingSystem";
import ExpenseTracker from "./ExpenseTracker";
import TravelerManager from "./TravelerManager";
import DestinationManager from "./DestinationManager";
import LodgingFilterModal from "../../components/LodgingFilterModal";
import TripMap from "../../components/TripMap";
import GoogleMapsLoader from "../../components/GoogleMapsLoader";

// Placeholder for avatars
const Avatar = ({ name }: { name: string }) => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-700 flex items-center justify-center text-white font-bold shadow-[0_0_8px_#ff00cc99] border-2 border-pink-500">
    {name?.[0]?.toUpperCase() || "?"}
  </div>
);

// Global Header Bar
const TripDesignerHeader = ({ tripTitle, tripDates, travelers, onInvite }: any) => (
  <header className="w-full flex items-center justify-between px-6 py-3 bg-[#101010] shadow-lg sticky top-0 z-30 border-b border-pink-500/30">
    <div className="flex items-center gap-3">
      <span className="text-2xl font-bold tracking-tight text-white/90 hover:text-pink-400 transition-all cursor-pointer">{tripTitle || "Trip Title"}</span>
    </div>
    <div className="flex items-center gap-2">
      <CalendarIcon className="w-5 h-5 text-pink-400 mr-1" />
      <span className="text-lg font-medium text-white/80">{tripDates || "Select Dates"}</span>
    </div>
    <div className="flex items-center gap-2">
      {travelers?.map((t: any) => <Avatar key={t.id} name={t.name} />)}
      <button onClick={onInvite} className="ml-2 w-8 h-8 rounded-full bg-pink-600 hover:bg-pink-500 flex items-center justify-center shadow-[0_0_8px_#ff00cc99] transition-all">
        <PlusIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  </header>
);

// Toolbox Tabs
const TOOLBOX_TABS = [
  { key: "chat", label: "Chat & Polls", icon: <ChatBubbleLeftRightIcon className="w-5 h-5 mr-1" /> },
  { key: "expenses", label: "Expenses", icon: <CurrencyDollarIcon className="w-5 h-5 mr-1" /> },
  { key: "settings", label: "Trip Settings", icon: <Cog6ToothIcon className="w-5 h-5 mr-1" /> },
];

export default function TripDesignerPage() {
  // Placeholder state
  const [activeTab, setActiveTab] = useState("chat");
  const [tabHover, setTabHover] = useState<string | null>(null);
  const [dashboardTab, setDashboardTab] = useState<'timeline' | 'map'>('timeline');
  const [showMobileToolbox, setShowMobileToolbox] = useState(false);
  const [showLodgingModal, setShowLodgingModal] = useState(false);
  const [lodgingMarkers, setLodgingMarkers] = useState<any[]>([]);
  const [selectedLodgingId, setSelectedLodgingId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 36.1147, lng: -115.1728 }); // Default: Las Vegas
  // Mock data for sidebar tools
  const travelers = [
    { id: "1", name: "Alice", email: "alice@example.com" },
    { id: "2", name: "Bob", email: "bob@example.com" },
    { id: "3", name: "Charlie", email: "charlie@example.com" },
  ];
  const destinations = [
    { id: "d1", name: "Borgata", location: "Atlantic City, NJ" },
    { id: "d2", name: "Bellagio", location: "Las Vegas, NV" },
  ];
  const expenses = [
    { id: "e1", description: "Hotel", amount: 1200, paidBy: "1", splitBetween: ["1", "2", "3"] },
    { id: "e2", description: "Dinner", amount: 300, paidBy: "2", splitBetween: ["1", "2", "3"] },
  ];
  const tripTitle = "AC Weekend Getaway";
  const tripDates = "Aug 15 - Aug 18, 2025";

  // Handler to show lodging on map
  const handleShowLodgingOnMap = (hotels: any[], selectedId?: string) => {
    setLodgingMarkers(hotels.map(hotel => ({
      id: hotel.place_id,
      position: hotel.geometry.location,
      label: hotel.name[0],
    })));
    if (selectedId) {
      setSelectedLodgingId(selectedId);
      const hotel = hotels.find(h => h.place_id === selectedId);
      if (hotel) setMapCenter(hotel.geometry.location);
    }
  };

  return (
    <div className="min-h-screen bg-[#101010]">
      <TripDesignerHeader
        tripTitle={tripTitle}
        tripDates={tripDates}
        travelers={travelers}
        onInvite={() => alert("Invite modal coming soon!")}
      />
      {/* Find Lodging Button */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 mt-4 flex justify-end">
        <button
          className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all text-lg"
          onClick={() => setShowLodgingModal(true)}
        >
          Find Lodging
        </button>
      </div>
      {/* Lodging Filter Modal */}
      {showLodgingModal && (
        <LodgingFilterModal
          onClose={() => setShowLodgingModal(false)}
          onShowHotelsOnMap={handleShowLodgingOnMap}
        />
      )}
      {/* Main Layout: Responsive */}
      <main className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-2 md:px-4 py-4 md:py-10">
        {/* Dashboard (Left) */}
        <section className="flex-[2] min-w-0 w-full">
          {/* Tab bar for Timeline/Map */}
          <div className="flex gap-2 mb-4 md:mb-6">
            <button
              className={`flex items-center px-3 md:px-4 py-2 rounded-t-lg font-semibold shadow-[0_0_8px_#ff00cc55] border-b-2 focus:outline-none transition-all
                ${dashboardTab === 'timeline' ? 'bg-gray-900/80 text-pink-400 border-pink-500/80' : 'bg-gray-900/60 text-gray-400 border-transparent hover:text-pink-400'}`}
              onClick={() => setDashboardTab('timeline')}
            >
              <MapIcon className="w-5 h-5 mr-2" />Timeline
            </button>
            <button
              className={`flex items-center px-3 md:px-4 py-2 rounded-t-lg font-semibold border-b-2 focus:outline-none transition-all
                ${dashboardTab === 'map' ? 'bg-gray-900/80 text-pink-400 border-pink-500/80 shadow-[0_0_8px_#ff00cc55]' : 'bg-gray-900/60 text-gray-400 border-transparent hover:text-pink-400'}`}
              onClick={() => setDashboardTab('map')}
            >
              <MapIcon className="w-5 h-5 mr-2" />Map
            </button>
          </div>
          {/* Dashboard Tab Panels */}
          {dashboardTab === 'timeline' && <Timeline />}
          {dashboardTab === 'map' && (
            <div className="bg-gray-900/80 rounded-xl shadow-lg p-4 md:p-8 min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center border border-gray-800 relative">
              <span className="text-xl md:text-2xl text-white/80 font-bold mb-2">Map View</span>
              <span className="text-pink-400 mb-4 md:mb-6">(Destinations and lodging will appear as pins here)</span>
              <GoogleMapsLoader>
                <TripMap
                  center={mapCenter}
                  markers={[
                    ...destinations.map((d) => ({
                      id: d.id,
                      position: d.id === "d2" ? { lat: 36.1147, lng: -115.1728 } : { lat: 39.3643, lng: -74.4229 },
                      label: d.name[0],
                    })),
                    ...lodgingMarkers,
                  ]}
                  selectedMarkerId={selectedLodgingId || undefined}
                  onMarkerClick={setSelectedLodgingId}
                />
              </GoogleMapsLoader>
            </div>
          )}
        </section>
        {/* Toolbox (Right) - Desktop Only */}
        <aside className="hidden md:flex flex-1 min-w-[320px] bg-gray-900/80 rounded-xl shadow-lg p-0 border border-gray-800 flex-col">
          {/* Tabs */}
          <div className="flex border-b border-pink-500/30">
            {TOOLBOX_TABS.map(tab => (
              <button
                key={tab.key}
                className={`flex-1 flex items-center justify-center gap-1 py-3 px-2 font-semibold text-base transition-all
                  ${activeTab === tab.key ? "text-pink-400 border-b-2 border-pink-500 bg-black/40 shadow-[0_0_8px_#ff00cc55]" :
                    (tabHover === tab.key ? "text-pink-300" : "text-gray-400")}
                `}
                onClick={() => setActiveTab(tab.key)}
                onMouseEnter={() => setTabHover(tab.key)}
                onMouseLeave={() => setTabHover(null)}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
          {/* Tab Panels */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "chat" && (
              <div className="flex flex-col gap-6">
                <GroupChat />
                <VotingSystem />
              </div>
            )}
            {activeTab === "expenses" && (
              <ExpenseTracker
                expenses={expenses}
                onAdd={() => {}}
                onRemove={() => {}}
                travelers={travelers}
              />
            )}
            {activeTab === "settings" && (
              <div className="flex flex-col gap-6">
                <TravelerManager
                  travelers={travelers}
                  onAdd={() => {}}
                  onRemove={() => {}}
                />
                <DestinationManager
                  destinations={destinations}
                  onAdd={() => {}}
                  onRemove={() => {}}
                />
              </div>
            )}
          </div>
        </aside>
        {/* Toolbox - Mobile: Bottom Nav & Modal */}
        <div className="fixed md:hidden bottom-0 left-0 w-full bg-[#181828] border-t border-pink-500/30 flex z-40">
          {TOOLBOX_TABS.map(tab => (
            <button
              key={tab.key}
              className={`flex-1 flex flex-col items-center justify-center py-2 text-xs font-semibold transition-all
                ${activeTab === tab.key ? "text-pink-400" : "text-gray-400"}`}
              onClick={() => { setActiveTab(tab.key); setShowMobileToolbox(true); }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        {/* Mobile Toolbox Modal */}
        {showMobileToolbox && (
          <div className="fixed inset-0 bg-black/70 flex items-end z-50 md:hidden" onClick={() => setShowMobileToolbox(false)}>
            <div className="w-full bg-gray-900/95 rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-4 text-pink-400 text-2xl font-bold" onClick={() => setShowMobileToolbox(false)}>&times;</button>
              {activeTab === "chat" && (
                <div className="flex flex-col gap-6">
                  <GroupChat />
                  <VotingSystem />
                </div>
              )}
              {activeTab === "expenses" && (
                <ExpenseTracker
                  expenses={expenses}
                  onAdd={() => {}}
                  onRemove={() => {}}
                  travelers={travelers}
                />
              )}
              {activeTab === "settings" && (
                <div className="flex flex-col gap-6">
                  <TravelerManager
                    travelers={travelers}
                    onAdd={() => {}}
                    onRemove={() => {}}
                  />
                  <DestinationManager
                    destinations={destinations}
                    onAdd={() => {}}
                    onRemove={() => {}}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 
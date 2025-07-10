'use client';

import { useState } from 'react';
import Head from 'next/head';
import { Destination, Tournament } from '@/lib/types';
import DestinationSelector from '@/components/trip-designer/DestinationSelector';
import TournamentSelector from '@/components/trip-designer/TournamentSelector';
import TripSummary from '@/components/trip-designer/TripSummary';

export default function TripDesignerPage() {
  // State for selected items
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
  const [selectedTournaments, setSelectedTournaments] = useState<Tournament[]>([]);
  const [currentStep, setCurrentStep] = useState<'destinations' | 'tournaments' | 'summary'>('destinations');

  // Handle destination selection
  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestinations(prev => [...prev, destination]);
  };

  // Handle tournament selection
  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournaments(prev => [...prev, tournament]);
  };

  // Handle removing destinations
  const handleRemoveDestination = (destinationId: string) => {
    setSelectedDestinations(prev => prev.filter(dest => dest._id !== destinationId));
  };

  // Handle removing tournaments
  const handleRemoveTournament = (tournamentId: string) => {
    setSelectedTournaments(prev => prev.filter(tournament => tournament._id !== tournamentId));
  };

  // Get step number for display
  const getStepNumber = (step: string) => {
    switch (step) {
      case 'destinations': return 1;
      case 'tournaments': return 2;
      case 'summary': return 3;
      default: return 1;
    }
  };

  // Check if step is completed
  const isStepCompleted = (step: string) => {
    switch (step) {
      case 'destinations': return selectedDestinations.length > 0;
      case 'tournaments': return selectedTournaments.length > 0;
      case 'summary': return false; // Summary is always the final step
      default: return false;
    }
  };

  // Check if step is accessible
  const isStepAccessible = (step: string) => {
    switch (step) {
      case 'destinations': return true;
      case 'tournaments': return selectedDestinations.length > 0;
      case 'summary': return selectedDestinations.length > 0 || selectedTournaments.length > 0;
      default: return false;
    }
  };

  return (
    <>
      <Head>
        <title>Interactive Trip Planner - Felt2Felt</title>
        <meta name="description" content="Design your perfect poker trip." />
      </Head>
      <main className="min-h-screen bg-[#0D0D0D]">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-5xl font-orbitron font-bold mb-4 text-center neon-glow">INTERACTIVE TRIP PLANNER</h1>
          <p className="text-center text-gray-300 mb-12 text-lg">Build your custom poker itinerary in a few easy steps</p>

          {/* Step Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[
                { key: 'destinations', label: 'Destinations' },
                { key: 'tournaments', label: 'Tournaments' },
                { key: 'summary', label: 'Summary' }
              ].map((step, index) => (
                <div key={step.key} className="flex items-center">
                  <button
                    onClick={() => isStepAccessible(step.key) && setCurrentStep(step.key as 'destinations' | 'tournaments' | 'summary')}
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold transition-all
                      ${currentStep === step.key
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-black'
                        : isStepCompleted(step.key)
                        ? 'bg-green-600 text-white'
                        : isStepAccessible(step.key)
                        ? 'bg-gray-600 text-white hover:bg-gray-500 cursor-pointer'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }
                    `}
                    disabled={!isStepAccessible(step.key)}
                  >
                    {getStepNumber(step.key)}
                  </button>
                  <span className={`ml-2 font-medium ${
                    currentStep === step.key ? 'text-pink-400' :
                    isStepAccessible(step.key) ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < 2 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      isStepCompleted(step.key) ? 'bg-green-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Current Step Content */}
            <div className="lg:col-span-2">
              {currentStep === 'destinations' && (
                <div className="card-style p-8">
                  <h2 className="text-3xl font-orbitron font-bold mb-6 flex items-center text-white">
                    <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">1</span>
                    Select Destinations
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Choose the poker destinations you want to visit. You can select multiple cities to create a multi-stop trip.
                  </p>
                  <DestinationSelector
                    onDestinationSelect={handleDestinationSelect}
                    selectedDestinations={selectedDestinations}
                  />
                  {selectedDestinations.length > 0 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setCurrentStep('tournaments')}
                        className="btn-primary px-8 py-3"
                      >
                        Continue to Tournaments →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'tournaments' && (
                <div className="card-style p-8">
                  <h2 className="text-3xl font-orbitron font-bold mb-6 flex items-center text-white">
                    <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">2</span>
                    Find Tournaments
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Browse upcoming tournaments in your selected destinations. Add tournaments to your trip itinerary.
                  </p>
                  <TournamentSelector
                    onTournamentSelect={handleTournamentSelect}
                    selectedTournaments={selectedTournaments}
                    selectedDestinations={selectedDestinations}
                  />
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep('destinations')}
                      className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                    >
                      ← Back to Destinations
                    </button>
                    <button
                      onClick={() => setCurrentStep('summary')}
                      className="btn-primary px-8 py-3"
                    >
                      View Trip Summary →
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'summary' && (
                <div className="card-style p-8">
                  <h2 className="text-3xl font-orbitron font-bold mb-6 flex items-center text-white">
                    <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">3</span>
                    Trip Summary
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Review your trip details, add notes, and export your itinerary.
                  </p>
                  <TripSummary
                    selectedDestinations={selectedDestinations}
                    selectedTournaments={selectedTournaments}
                    onRemoveDestination={handleRemoveDestination}
                    onRemoveTournament={handleRemoveTournament}
                  />
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setCurrentStep('tournaments')}
                      className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                    >
                      ← Back to Tournaments
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Trip Summary */}
            <aside>
              <div className="sticky top-24">
                <TripSummary
                  selectedDestinations={selectedDestinations}
                  selectedTournaments={selectedTournaments}
                  onRemoveDestination={handleRemoveDestination}
                  onRemoveTournament={handleRemoveTournament}
                />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
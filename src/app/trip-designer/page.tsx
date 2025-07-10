'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { UserPlus, Users, Wifi, WifiOff } from 'lucide-react';
import { Destination, Tournament } from '@/lib/types';
import DestinationSelector from '@/components/trip-designer/DestinationSelector';
import TournamentSelector from '@/components/trip-designer/TournamentSelector';
import TripSummary from '@/components/trip-designer/TripSummary';
import InviteModal from '@/components/trip-designer/InviteModal';
import CollaboratorList from '@/components/trip-designer/CollaboratorList';
import { useCollaboration } from '@/hooks/useCollaboration';
import { PUSHER_EVENTS } from '@/lib/pusher';

export default function TripDesignerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for selected items
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
  const [selectedTournaments, setSelectedTournaments] = useState<Tournament[]>([]);
  const [currentStep, setCurrentStep] = useState<'destinations' | 'tournaments' | 'summary'>('destinations');
  
  // Collaboration state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time collaboration
  const { activeUsers, isConnected, broadcastEvent } = useCollaboration({
    itineraryId: currentItinerary?._id || '',
    onDestinationAdded: (destination) => {
      setSelectedDestinations(prev => [...prev, destination]);
    },
    onDestinationRemoved: (destinationId) => {
      setSelectedDestinations(prev => prev.filter(dest => dest._id !== destinationId));
    },
    onTournamentAdded: (tournament) => {
      setSelectedTournaments(prev => [...prev, tournament]);
    },
    onTournamentRemoved: (tournamentId) => {
      setSelectedTournaments(prev => prev.filter(tournament => tournament._id !== tournamentId));
    },
    onCollaboratorAdded: (collaborator) => {
      setCurrentItinerary((prev: any) => ({
        ...prev,
        collaborators: [...(prev?.collaborators || []), collaborator]
      }));
    },
    onCollaboratorRemoved: (collaboratorId) => {
      setCurrentItinerary((prev: any) => ({
        ...prev,
        collaborators: (prev?.collaborators || []).filter((c: any) => c.user._id !== collaboratorId)
      }));
    },
  });

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    // Load or create itinerary
    loadItinerary();
  }, [session, status, router]);

  const loadItinerary = async () => {
    try {
      // For now, create a default itinerary if none exists
      // In a real app, you might want to load from URL params or user's saved itineraries
      const defaultItinerary = {
        _id: 'temp-id',
        name: 'My Poker Trip',
        owner: {
          _id: session?.user?.id,
          name: session?.user?.name,
          email: session?.user?.email
        },
        collaborators: [],
        items: []
      };
      
      setCurrentItinerary(defaultItinerary);
    } catch (error) {
      console.error('Failed to load itinerary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-neon mx-auto mb-4"></div>
          <p className="text-gray-300">Loading trip designer...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  const isOwner = currentItinerary?.owner?._id === session.user.id;

  // Handle destination selection
  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestinations(prev => [...prev, destination]);
    // Broadcast to other collaborators
    broadcastEvent(PUSHER_EVENTS.DESTINATION_ADDED, { destination });
  };

  // Handle tournament selection
  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournaments(prev => [...prev, tournament]);
    // Broadcast to other collaborators
    broadcastEvent(PUSHER_EVENTS.TOURNAMENT_ADDED, { tournament });
  };

  // Handle removing destinations
  const handleRemoveDestination = (destinationId: string) => {
    setSelectedDestinations(prev => prev.filter(dest => dest._id !== destinationId));
    // Broadcast to other collaborators
    broadcastEvent(PUSHER_EVENTS.DESTINATION_REMOVED, { destinationId });
  };

  // Handle removing tournaments
  const handleRemoveTournament = (tournamentId: string) => {
    setSelectedTournaments(prev => prev.filter(tournament => tournament._id !== tournamentId));
    // Broadcast to other collaborators
    broadcastEvent(PUSHER_EVENTS.TOURNAMENT_REMOVED, { tournamentId });
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
      <main className="trip-designer-page">
        <div className="trip-designer-container">
          {/* Header with collaboration controls */}
          <div className="trip-designer-header">
            <div className="trip-designer-title-section">
              <h1 className="trip-designer-title">
                {currentItinerary?.name || 'INTERACTIVE TRIP PLANNER'}
              </h1>
              <p className="trip-designer-subtitle">Build your custom poker trip in a few easy steps</p>
            </div>
            
            {/* Collaboration Controls */}
            <div className="trip-designer-controls">
              {/* Connection Status */}
              <div className={`trip-designer-status ${
                isConnected ? 'trip-designer-status-connected' : 'trip-designer-status-offline'
              }`}>
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 mr-2" />
                    Live ({activeUsers.length})
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 mr-2" />
                    Offline
                  </>
                )}
              </div>

              <button
                onClick={() => setShowCollaborators(!showCollaborators)}
                className="trip-designer-collaborators-btn"
              >
                <Users className="w-5 h-5 mr-2" />
                Collaborators ({(currentItinerary?.collaborators?.length || 0) + 1})
              </button>
              
              {isOwner && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="trip-designer-invite-btn"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Invite
                </button>
              )}
            </div>
          </div>

          {/* Collaborators Panel */}
          {showCollaborators && currentItinerary && (
            <div className="mb-8">
              <CollaboratorList
                owner={currentItinerary.owner}
                collaborators={currentItinerary.collaborators || []}
                currentUserId={session.user.id}
                isOwner={isOwner}
              />
            </div>
          )}

          {/* Step Navigation */}
          <div className="trip-designer-steps">
            <div className="trip-designer-steps-container">
              {[
                { key: 'destinations', label: 'Destinations' },
                { key: 'tournaments', label: 'Tournaments' },
                { key: 'summary', label: 'Summary' }
              ].map((step, index) => (
                <div key={step.key} className="trip-designer-step-item">
                  <button
                    onClick={() => isStepAccessible(step.key) && setCurrentStep(step.key as 'destinations' | 'tournaments' | 'summary')}
                    className={`trip-designer-step-btn ${
                      currentStep === step.key ? 'trip-designer-step-active' :
                      isStepCompleted(step.key) ? 'trip-designer-step-completed' :
                      isStepAccessible(step.key) ? 'trip-designer-step-accessible' :
                      'trip-designer-step-disabled'
                    }`}
                    disabled={!isStepAccessible(step.key)}
                  >
                    {getStepNumber(step.key)}
                  </button>
                  <span className={`trip-designer-step-label ${
                    currentStep === step.key ? 'trip-designer-step-label-active' :
                    isStepAccessible(step.key) ? 'trip-designer-step-label-accessible' :
                    'trip-designer-step-label-disabled'
                  }`}>
                    {step.label}
                  </span>
                  {index < 2 && (
                    <div className={`trip-designer-step-connector ${
                      isStepCompleted(step.key) ? 'trip-designer-step-connector-completed' : 'trip-designer-step-connector-default'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Designer Grid - Two Column Layout */}
          <div className="designer-grid">
            {/* Left Column: Designer Controls */}
            <div className="designer-controls">
              {currentStep === 'destinations' && (
                <div className="card-style">
                  <h2 className="trip-designer-step-title">
                    <span className="trip-designer-step-number">1</span>
                    Select Destinations
                  </h2>
                  <p className="trip-designer-step-description">
                    Choose the poker destinations you want to visit. You can select multiple cities to create a multi-stop trip.
                  </p>
                  <DestinationSelector
                    onDestinationSelect={handleDestinationSelect}
                    selectedDestinations={selectedDestinations}
                  />
                  {selectedDestinations.length > 0 && (
                    <div className="trip-designer-step-actions">
                      <button
                        onClick={() => setCurrentStep('tournaments')}
                        className="trip-designer-continue-btn"
                      >
                        Continue to Tournaments →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'tournaments' && (
                <div className="card-style">
                  <h2 className="trip-designer-step-title">
                    <span className="trip-designer-step-number">2</span>
                    Find Tournaments
                  </h2>
                  <p className="trip-designer-step-description">
                    Browse upcoming tournaments in your selected destinations. Add tournaments to your trip itinerary.
                  </p>
                  <TournamentSelector
                    onTournamentSelect={handleTournamentSelect}
                    selectedTournaments={selectedTournaments}
                    selectedDestinations={selectedDestinations}
                  />
                  <div className="trip-designer-step-navigation">
                    <button
                      onClick={() => setCurrentStep('destinations')}
                      className="trip-designer-back-btn"
                    >
                      ← Back to Destinations
                    </button>
                    <button
                      onClick={() => setCurrentStep('summary')}
                      className="trip-designer-continue-btn"
                    >
                      View Trip Summary →
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'summary' && (
                <div className="card-style">
                  <h2 className="trip-designer-step-title">
                    <span className="trip-designer-step-number">3</span>
                    Trip Summary
                  </h2>
                  <p className="trip-designer-step-description">
                    Review your trip details, add notes, and export your itinerary.
                  </p>
                  <TripSummary
                    selectedDestinations={selectedDestinations}
                    selectedTournaments={selectedTournaments}
                    onRemoveDestination={handleRemoveDestination}
                    onRemoveTournament={handleRemoveTournament}
                  />
                  <div className="trip-designer-step-actions">
                    <button
                      onClick={() => setCurrentStep('tournaments')}
                      className="trip-designer-back-btn"
                    >
                      ← Back to Tournaments
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Summary and Map */}
            <div className="summary-map-column">
              <div className="trip-designer-sidebar">
                {/* Trip Map Placeholder */}
                <div className="card-style">
                  <h3 className="trip-designer-map-title">Trip Map</h3>
                  <div className="trip-designer-map-container">
                    <p className="trip-designer-map-placeholder">Interactive map will be displayed here</p>
                  </div>
                </div>

                {/* Itinerary Summary */}
                <div className="itinerary-summary">
                  <TripSummary
                    selectedDestinations={selectedDestinations}
                    selectedTournaments={selectedTournaments}
                    onRemoveDestination={handleRemoveDestination}
                    onRemoveTournament={handleRemoveTournament}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Modal */}
        <InviteModal
          isOpen={showInviteModal}
          itineraryId={currentItinerary?._id || ''}
          itineraryName={currentItinerary?.name || 'Trip'}
          onClose={() => setShowInviteModal(false)}
        />
      </main>
    </>
  );
}
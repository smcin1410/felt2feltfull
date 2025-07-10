import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { pusherClient, getItineraryChannel, PUSHER_EVENTS } from '@/lib/pusher';
import { toast } from 'react-hot-toast';

interface CollaborationUser {
  id: string;
  name: string;
  email: string;
}

interface UseCollaborationProps {
  itineraryId: string;
  onItineraryUpdate?: (data: any) => void;
  onDestinationAdded?: (destination: any) => void;
  onDestinationRemoved?: (destinationId: string) => void;
  onTournamentAdded?: (tournament: any) => void;
  onTournamentRemoved?: (tournamentId: string) => void;
  onCollaboratorAdded?: (collaborator: any) => void;
  onCollaboratorRemoved?: (collaboratorId: string) => void;
}

export function useCollaboration({
  itineraryId,
  onItineraryUpdate,
  onDestinationAdded,
  onDestinationRemoved,
  onTournamentAdded,
  onTournamentRemoved,
  onCollaboratorAdded,
  onCollaboratorRemoved,
}: UseCollaborationProps) {
  const { data: session } = useSession();
  const [activeUsers, setActiveUsers] = useState<CollaborationUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!session?.user?.id || !itineraryId) return;


    const channelName = getItineraryChannel(itineraryId);
    if (!pusherClient) {
      console.error('Pusher client not initialized');
      toast.error('Real-time features are unavailable.');
      return;
    }
    const channel = pusherClient.subscribe(channelName);
    channelRef.current = channel;

    // Connection events
    channel.bind('pusher:subscription_succeeded', (members: any) => {
      setIsConnected(true);
      const users = Object.values(members.members).map((member: any) => ({
        id: member.id,
        name: member.info.name,
        email: member.info.email,
      }));
      setActiveUsers(users);
    });

    channel.bind('pusher:subscription_error', (error: any) => {
      console.error('Pusher subscription error:', error);
      toast.error('Failed to connect to real-time collaboration');
    });

    // Member events
    channel.bind('pusher:member_added', (member: any) => {
      const user = {
        id: member.id,
        name: member.info.name,
        email: member.info.email,
      };
      setActiveUsers(prev => [...prev, user]);
      
      if (member.id !== session.user.id) {
        toast.success(`${member.info.name} joined the trip`);
      }
    });

    channel.bind('pusher:member_removed', (member: any) => {
      setActiveUsers(prev => prev.filter(user => user.id !== member.id));
      
      if (member.id !== session.user.id) {
        toast(`${member.info.name} left the trip`);
      }
    });

    // Itinerary events
    channel.bind(PUSHER_EVENTS.ITINERARY_UPDATED, (data: any) => {
      if (data.userId !== session.user.id) {
        onItineraryUpdate?.(data);
        toast.success(`Trip updated by ${data.userName}`);
      }
    });

    channel.bind(PUSHER_EVENTS.DESTINATION_ADDED, (data: any) => {
      if (data.userId !== session.user.id) {
        onDestinationAdded?.(data.destination);
        toast.success(`${data.userName} added ${data.destination.name}`);
      }
    });

    channel.bind(PUSHER_EVENTS.DESTINATION_REMOVED, (data: any) => {
      if (data.userId !== session.user.id) {
        onDestinationRemoved?.(data.destinationId);
        toast(`${data.userName} removed a destination`);
      }
    });

    channel.bind(PUSHER_EVENTS.TOURNAMENT_ADDED, (data: any) => {
      if (data.userId !== session.user.id) {
        onTournamentAdded?.(data.tournament);
        toast.success(`${data.userName} added ${data.tournament.name}`);
      }
    });

    channel.bind(PUSHER_EVENTS.TOURNAMENT_REMOVED, (data: any) => {
      if (data.userId !== session.user.id) {
        onTournamentRemoved?.(data.tournamentId);
        toast(`${data.userName} removed a tournament`);
      }
    });

    channel.bind(PUSHER_EVENTS.COLLABORATOR_ADDED, (data: any) => {
      if (data.userId !== session.user.id) {
        onCollaboratorAdded?.(data.collaborator);
        toast.success(`${data.userName} invited ${data.collaborator.email}`);
      }
    });

    channel.bind(PUSHER_EVENTS.COLLABORATOR_REMOVED, (data: any) => {
      if (data.userId !== session.user.id) {
        onCollaboratorRemoved?.(data.collaboratorId);
        toast(`${data.userName} removed a collaborator`);
      }
    });

    return () => {
      if (channelRef.current) {
        if (pusherClient) {
          pusherClient.unsubscribe(channelName);
        }
        channelRef.current = null;
      }
      setIsConnected(false);
      setActiveUsers([]);
    };
  }, [session?.user?.id, itineraryId]);

  // Helper function to broadcast events
  const broadcastEvent = async (eventType: string, data: any) => {
    if (!session?.user) return;

    try {
      await fetch('/api/pusher/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: getItineraryChannel(itineraryId),
          event: eventType,
          data: {
            ...data,
            userId: session.user.id,
            userName: session.user.name,
          },
        }),
      });
    } catch (error) {
      console.error('Failed to broadcast event:', error);
    }
  };

  return {
    activeUsers,
    isConnected,
    broadcastEvent,
  };
}
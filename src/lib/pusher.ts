import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: '/api/pusher/auth',
    auth: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }
);

// Channel names
export const getItineraryChannel = (itineraryId: string) => `itinerary-${itineraryId}`;

// Event types
export const PUSHER_EVENTS = {
  ITINERARY_UPDATED: 'itinerary-updated',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  DESTINATION_ADDED: 'destination-added',
  DESTINATION_REMOVED: 'destination-removed',
  TOURNAMENT_ADDED: 'tournament-added',
  TOURNAMENT_REMOVED: 'tournament-removed',
  COLLABORATOR_ADDED: 'collaborator-added',
  COLLABORATOR_REMOVED: 'collaborator-removed',
} as const;

export type PusherEvent = typeof PUSHER_EVENTS[keyof typeof PUSHER_EVENTS];
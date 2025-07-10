import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Check if Pusher environment variables are available
const pusherAppId = process.env.PUSHER_APP_ID;
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherSecret = process.env.PUSHER_SECRET;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

// Server-side Pusher instance
export const pusherServer = pusherAppId && pusherKey && pusherSecret && pusherCluster
  ? new Pusher({
      appId: pusherAppId,
      key: pusherKey,
      secret: pusherSecret,
      cluster: pusherCluster,
      useTLS: true,
    })
  : null;

// Client-side Pusher instance
export const pusherClient = pusherKey && pusherCluster
  ? new PusherClient(pusherKey, {
      cluster: pusherCluster,
      authEndpoint: '/api/pusher/auth',
      auth: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    })
  : null;

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
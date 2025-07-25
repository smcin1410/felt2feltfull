// Trip Designer Data Models
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  pokerRoomInfo?: string;
  amenities?: string[];
}

export type ItineraryItemType = 'tournament' | 'cash_game' | 'travel' | 'lodging' | 'activity';

export interface ItineraryItem {
  id: string;
  type: ItineraryItemType;
  title: string;
  details?: string;
  startDate: string;
  endDate?: string;
  destinationId?: string;
  participants?: string[]; // user ids
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  travelers: User[];
  destinations: Destination[];
  itinerary: ItineraryItem[];
  expenses?: Expense[];
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // user id
  splitBetween: string[]; // user ids
} 
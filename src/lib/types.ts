// Shared TypeScript interfaces for the Felt2Felt application

// Core destination and poker room types
export interface PokerRoom {
  _id: string;
  name: string;
  description: string;
  address?: string;
  phone?: string;
  website?: string;
  games?: string[];
  stakes?: string[];
}

export interface Tournament {
  _id: string;
  name: string;
  location: string;
  buyIn: number;
  date: string;
  endDate: string;
  description: string;
  image: string;
  prizePool: number;
  players: number;
  status: 'Upcoming' | 'Active' | 'Completed';
  seriesName?: string;
  majorCircuit?: 'WSOP' | 'WPT' | 'EPT' | 'PGT' | 'MSPT' | 'Independent';
  city?: string;
  region?: string;
  country?: string;
  officialSite?: string;
  tags?: string[];
}

export interface Destination {
  _id: string;
  city: string;
  country: string;
  description: string;
  image: string;
  pokerRooms: PokerRoom[];
  tournaments: Tournament[];
  region?: string;
  timezone?: string;
  currency?: string;
  language?: string;
  bestTimeToVisit?: string;
  averageBuyIn?: string;
}

// Community and blog types
export interface Post {
  _id: string;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  replies: number;
  likes: number;
  category: string;
  isBlogPost: boolean;
  user?: string;
  authorEmail?: string;
  authorRank?: string;
  city?: string;
  comments?: Comment[];
}

export interface Comment {
  _id?: string;
  user?: string;
  authorEmail?: string;
  text: string;
  authorRank?: string;
  date: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  slug: string;
  tags: string[];
  image?: string;
  readTime?: number;
}

// Itinerary and trip planning types
export interface ItineraryItem {
  _id: string;
  name: string;
  type: 'Tournament' | 'Destination' | 'PokerRoom';
  location?: string;
  date?: string;
  notes?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface Trip {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  destinations: string[]; // Destination IDs
  tournaments: string[]; // Tournament IDs
  pokerRooms: string[]; // PokerRoom IDs
  budget?: number;
  status: 'Planning' | 'Booked' | 'Active' | 'Completed';
  isPublic: boolean;
  collaborators?: string[]; // User IDs
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
}

// Filter and search types
export interface DestinationFilters {
  searchQuery: string;
  selectedCountry: string;
  selectedCity: string;
  selectedRegion?: string;
  minPokerRooms?: number;
  maxPokerRooms?: number;
  hasUpcomingTournaments?: boolean;
}

export interface TournamentFilters {
  searchQuery: string;
  selectedLocation: string;
  selectedCircuit: string;
  minBuyIn: number;
  maxBuyIn: number;
  dateRange: {
    start: string;
    end: string;
  };
  status: string;
  selectedTags: string[];
}

export interface PostFilters {
  searchQuery: string;
  selectedCategory: string;
  selectedAuthor?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy: 'newest' | 'oldest' | 'mostLiked' | 'mostReplies';
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface CreatePostForm {
  title: string;
  content: string;
  category: string;
  city?: string;
}

export interface TripPlannerForm {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget?: number;
  isPublic: boolean;
}

// User and authentication types (for future implementation)
export interface User {
  _id: string;
  email: string;
  name: string;
  rank?: string;
  avatar?: string;
  preferences?: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  favoriteDestinations: string[];
  preferredStakes: string[];
  preferredGames: string[];
  notifications: {
    email: boolean;
    push: boolean;
    tournaments: boolean;
    community: boolean;
  };
}

// Component prop types
export interface DestinationCardProps {
  destination: Destination;
  onAddToItinerary?: (destination: Destination) => void;
  showAddButton?: boolean;
}

export interface TournamentItemProps {
  tournament: Tournament;
  onAddToItinerary?: (tournament: Tournament) => void;
  showAddButton?: boolean;
  layout?: 'card' | 'list';
}

export interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onReply?: (postId: string) => void;
  showActions?: boolean;
}

// State management types
export interface ItineraryState {
  items: ItineraryItem[];
  isLoading: boolean;
  error: string | null;
}

export interface ItineraryActions {
  addItem: (item: ItineraryItem) => void;
  removeItem: (itemId: string) => void;
  clearItems: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Search and autocomplete types
export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'destination' | 'tournament' | 'poker-room' | 'post';
  category?: string;
}

export interface AutocompleteOption {
  value: string;
  label: string;
  category?: string;
}
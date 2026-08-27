export type Intent = 'layover' | 'dayuse' | 'couple' | 'localid';

export type Duration = 3 | 6 | 12;

export interface Hotel {
  id: string;
  name: string;
  area: string;
  city: string;
  image: string;
  rating: number;
  reviews: number;
  landmark: string;
  distanceKm: number;
  intents: Intent[];
  amenities: string[];
  coupleFriendly: boolean;
  localIdAccepted: boolean;
  instantConfirm: boolean;
  payAtHotel: boolean;
  businessFriendly: boolean;
  chain: string;
  collection: 'premium' | 'luxury' | null;
  slotsLeft: number;
  earliestSlot: string;
  rates: Record<Duration, number>;
  about: string;
  policies: string[];
}

export interface SearchState {
  city: string;
  location: string;
  date: string;
  checkIn: string;
  duration: Duration;
}

export type PayMode = 'part' | 'full';

export interface BookingDraft {
  hotelId: string;
  duration: Duration;
  checkIn: string;
  date: string;
  guests: number;
  payMode: PayMode;
}

export interface GuestDetails {
  name: string;
  phone: string;
  email: string;
}
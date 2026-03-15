export type PriorityMode = "time" | "cost" | "balanced";

export interface TripDetails {
  origin: string;
  destination: string;
  date: string; // ISO date string (yyyy-mm-dd)
  passengers: number;
}

export type CabinClass = "any" | "economy" | "premium-economy" | "business" | "first";

export interface SearchPreferences {
  maxPrice?: number;
  airlinePreference?: string;
  maxStops?: 0 | 1 | 2;
  cabinClass?: CabinClass;
  priorityMode: PriorityMode;
}

export type RankingBadgeType = "best-price" | "fastest-arrival" | "balanced-choice" | "alternative-hub";

export interface Layover {
  airport: string;
  durationMinutes: number;
}

export interface FlightOption {
  id: string;
  airline: string;
  airlineCode: string;
  logoUrl?: string;
  departureTime: string; // ISO datetime
  arrivalTime: string; // ISO datetime
  departureAirport: string;
  arrivalAirport: string;
  durationMinutes: number;
  stops: number;
  priceCents: number;
  badges: RankingBadgeType[];
  layovers?: Layover[];
  aircraftType?: string;
  bookingSource: "airline" | "ota";
  deepLink?: string;
}

export type SearchRunStatus = "pending" | "running" | "completed" | "failed";

export interface SearchRun {
  id: string;
  trip: TripDetails;
  preferences: SearchPreferences;
  status: SearchRunStatus;
  options: FlightOption[];
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}

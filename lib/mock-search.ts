import type {
  FlightOption,
  RankingBadgeType,
  SearchPreferences,
  TripDetails,
} from "@/lib/types";

function minutes(hours: number) {
  return Math.round(hours * 60);
}

function baseDate(date: string) {
  // Use local time; for MVP we don't need time zones.
  return new Date(`${date}T08:00:00`);
}

export function generateMockFlightOptions(
  trip: TripDetails,
  preferences: SearchPreferences,
): FlightOption[] {
  const base = baseDate(trip.date);

  const options: FlightOption[] = [
    {
      id: "opt-1",
      airline: "Skyline Air",
      airlineCode: "SKY123",
      departureTime: new Date(base.getTime()).toISOString(),
      arrivalTime: new Date(base.getTime() + minutes(5) * 60_000).toISOString(),
      departureAirport: trip.origin,
      arrivalAirport: trip.destination,
      durationMinutes: minutes(5),
      stops: 1,
      priceCents: 320_00,
      badges: ["best-price"],
      layovers: [
        {
          airport: "DEN",
          durationMinutes: minutes(1),
        },
      ],
      aircraftType: "Airbus A321neo",
      bookingSource: "ota",
      deepLink: "https://www.example-ota.com/booking/opt-1",
    },
    {
      id: "opt-2",
      airline: "Aurora Airlines",
      airlineCode: "AUR456",
      departureTime: new Date(base.getTime() + minutes(1) * 60_000).toISOString(),
      arrivalTime: new Date(base.getTime() + minutes(4) * 60_000).toISOString(),
      departureAirport: trip.origin,
      arrivalAirport: trip.destination,
      durationMinutes: minutes(3),
      stops: 0,
      priceCents: 540_00,
      badges: ["fastest-arrival"],
      layovers: [],
      aircraftType: "Boeing 787-9",
      bookingSource: "airline",
      deepLink: "https://www.example-airline.com/booking/opt-2",
    },
    {
      id: "opt-3",
      airline: "Vertex Air",
      airlineCode: "VTX789",
      departureTime: new Date(base.getTime() + minutes(2) * 60_000).toISOString(),
      arrivalTime: new Date(base.getTime() + minutes(6) * 60_000).toISOString(),
      departureAirport: trip.origin,
      arrivalAirport: trip.destination,
      durationMinutes: minutes(4),
      stops: 1,
      priceCents: 410_00,
      badges: ["balanced-choice"],
      layovers: [
        {
          airport: "ORD",
          durationMinutes: minutes(1.5),
        },
      ],
      aircraftType: "Airbus A320",
      bookingSource: "airline",
      deepLink: "https://www.example-airline.com/booking/opt-3",
    },
  ];

  // Light preference shaping: filter or adjust badges based on maxPrice / priority.
  const maxPrice = preferences.maxPrice;
  let filtered = options;

  if (typeof maxPrice === "number") {
    filtered = options.filter((opt) => opt.priceCents / 100 <= maxPrice);
    if (filtered.length === 0) {
      filtered = options;
    }
  }

  if (preferences.maxStops === 0) {
    const nonstop = filtered.filter((opt) => opt.stops === 0);
    if (nonstop.length > 0) filtered = nonstop;
  } else if (preferences.maxStops === 1) {
    filtered = filtered.filter((opt) => opt.stops <= 1);
  }

  // Adjust badges based on priority.
  const sortKey =
    preferences.priorityMode === "time"
      ? (opt: FlightOption) => opt.durationMinutes
      : preferences.priorityMode === "cost"
        ? (opt: FlightOption) => opt.priceCents
        : (opt: FlightOption) => opt.durationMinutes + opt.priceCents / 10;

  const sorted = [...filtered].sort((a, b) => sortKey(a) - sortKey(b));

  // Reassign primary badge to first option based on priority.
  if (sorted.length > 0) {
    const primaryBadge: RankingBadgeType =
      preferences.priorityMode === "time"
        ? "fastest-arrival"
        : preferences.priorityMode === "cost"
          ? "best-price"
          : "balanced-choice";
    sorted[0].badges = Array.from(
      new Set<RankingBadgeType>([primaryBadge, ...sorted[0].badges]),
    );
  }

  return sorted.slice(0, 5);
}

import type { FlightOption, SearchPreferences, TripDetails } from "@/lib/types";
import { generateMockFlightOptions } from "@/lib/mock-search";

interface NovaActSearchResponse {
  options?: FlightOption[];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function validateOptions(options: unknown): FlightOption[] {
  if (!Array.isArray(options)) return [];
  return options.filter(
    (option): option is FlightOption =>
      Boolean(
        option &&
          typeof option.id === "string" &&
          typeof option.airline === "string" &&
          typeof option.airlineCode === "string" &&
          typeof option.departureTime === "string" &&
          typeof option.arrivalTime === "string" &&
          typeof option.departureAirport === "string" &&
          typeof option.arrivalAirport === "string" &&
          typeof option.durationMinutes === "number" &&
          typeof option.stops === "number" &&
          typeof option.priceCents === "number" &&
          Array.isArray(option.badges) &&
          (option.bookingSource === "airline" || option.bookingSource === "ota"),
      ),
  );
}

function normalizeAirlineName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeAirportCode(code: string): string {
  return code.trim().toUpperCase();
}

function buildQueryUrl(base: string, params: Record<string, string | number>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    query.set(key, String(value));
  });
  return `${base}?${query.toString()}`;
}

interface AirlineBookingRule {
  pattern: RegExp;
  searchPageUrl: string;
  prefilledUrl?: (trip: TripDetails) => string;
}

function buildAirlineBookingUrl(airline: string, trip: TripDetails): string | null {
  const normalized = normalizeAirlineName(airline);
  const origin = normalizeAirportCode(trip.origin);
  const destination = normalizeAirportCode(trip.destination);
  const date = trip.date;
  const passengers = Math.max(1, trip.passengers);

  const rules: AirlineBookingRule[] = [
    {
      pattern: /\bdelta\b/,
      searchPageUrl: "https://www.delta.com/flight-search/book-a-flight",
      prefilledUrl: (details) =>
        buildQueryUrl("https://www.delta.com/flight-search/book-a-flight", {
          origin: normalizeAirportCode(details.origin),
          destination: normalizeAirportCode(details.destination),
          startDate: details.date,
          passengers: Math.max(1, details.passengers),
        }),
    },
    {
      pattern: /\bunited\b/,
      searchPageUrl: "https://www.united.com/en/us/book-flight/united-reservations",
      prefilledUrl: () =>
        buildQueryUrl("https://www.united.com/en/us/book-flight/united-reservations", {
          f: origin,
          t: destination,
          d: date,
          px: passengers,
          tt: "1",
        }),
    },
    {
      pattern: /\bamerican\b|\bamerican airlines\b/,
      searchPageUrl: "https://www.aa.com/booking/find-flights",
      prefilledUrl: () =>
        buildQueryUrl("https://www.aa.com/booking/find-flights", {
          from: origin,
          to: destination,
          departureDate: date,
          adults: passengers,
          type: "ONE_WAY",
        }),
    },
    {
      pattern: /\bsouthwest\b/,
      searchPageUrl: "https://www.southwest.com/air/booking/select.html",
      prefilledUrl: () =>
        buildQueryUrl("https://www.southwest.com/air/booking/select.html", {
          originationAirportCode: origin,
          destinationAirportCode: destination,
          departureDate: date,
          passengerType: "ADULT",
          int: "HOMEQBOMAIR",
        }),
    },
    {
      pattern: /\bjetblue\b/,
      searchPageUrl: "https://www.jetblue.com/booking/flights",
      prefilledUrl: () =>
        buildQueryUrl("https://www.jetblue.com/booking/flights", {
          from: origin,
          to: destination,
          depart: date,
          travelers: passengers,
        }),
    },
    {
      pattern: /\balaska\b/,
      // Reliability-first path that loaded consistently in testing.
      // We still pass best-effort search params on this stable URL.
      searchPageUrl: "https://www.alaskaair.com/en/",
      prefilledUrl: () =>
        buildQueryUrl("https://www.alaskaair.com/en/", {
          from: origin,
          to: destination,
          departureDate: date,
          adults: passengers,
        }),
    },
    {
      pattern: /\bspirit\b/,
      searchPageUrl: "https://www.spirit.com/book",
      prefilledUrl: () =>
        buildQueryUrl("https://www.spirit.com/book", {
          from: origin,
          to: destination,
          departureDate: date,
          passengers,
        }),
    },
    {
      pattern: /\bfrontier\b/,
      searchPageUrl: "https://booking.flyfrontier.com/Flight/InternalSelect",
      prefilledUrl: () =>
        buildQueryUrl("https://booking.flyfrontier.com/Flight/InternalSelect", {
          o1: origin,
          d1: destination,
          dd1: date,
          p: passengers,
          adt: passengers,
        }),
    },
    { pattern: /\bhawaiian\b/, searchPageUrl: "https://www.hawaiianairlines.com/book" },
    { pattern: /\bsun country\b|\bsuncountry\b/, searchPageUrl: "https://www.suncountry.com/book/flights" },
    { pattern: /\ballegiant\b/, searchPageUrl: "https://www.allegiantair.com/" },
    { pattern: /\bair canada\b/, searchPageUrl: "https://www.aircanada.com/us/en/aco/home/book/flights.html" },
    { pattern: /\bbritish airways\b|\bba\b/, searchPageUrl: "https://www.britishairways.com/travel/book/public/en_us" },
    { pattern: /\blufthansa\b/, searchPageUrl: "https://www.lufthansa.com/us/en/book" },
    { pattern: /\bair france\b/, searchPageUrl: "https://wwws.airfrance.us/search/flights" },
    { pattern: /\bklm\b/, searchPageUrl: "https://www.klm.com/home/us/en/booking" },
    { pattern: /\bemirates\b/, searchPageUrl: "https://www.emirates.com/us/english/book/" },
    { pattern: /\bqatar\b/, searchPageUrl: "https://www.qatarairways.com/en-us/book.html" },
    { pattern: /\bsingapore airlines\b/, searchPageUrl: "https://www.singaporeair.com/en_UK/us/plan-travel/book-flights/" },
    { pattern: /\betihad\b/, searchPageUrl: "https://www.etihad.com/en-us/book" },
    { pattern: /\bturkish\b/, searchPageUrl: "https://www.turkishairlines.com/en-us/flights/booking/" },
    { pattern: /\bvirgin atlantic\b/, searchPageUrl: "https://flights.virginatlantic.com/en-us/flights" },
  ];

  const match = rules.find((rule) => rule.pattern.test(normalized));
  if (!match) return null;
  if (match.prefilledUrl) return match.prefilledUrl(trip);
  return match.searchPageUrl;
}

function buildOtaFallbackUrl(trip: TripDetails): string {
  const query = encodeURIComponent(`${trip.origin} ${trip.destination} ${trip.date}`);
  return `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${encodeURIComponent(
    trip.origin,
  )},to:${encodeURIComponent(trip.destination)},departure:${encodeURIComponent(
    trip.date,
  )}TANYT&passengers=adults:${trip.passengers}&mode=search&search=${query}`;
}

function enrichBookingLinks(options: FlightOption[], trip: TripDetails): FlightOption[] {
  return options.map((option) => {
    const trimmedDeepLink = option.deepLink?.trim();
    if (trimmedDeepLink && /^https?:\/\//i.test(trimmedDeepLink)) {
      return option;
    }

    const airlineUrl = buildAirlineBookingUrl(option.airline, trip);
    // Prefer airline search pages whenever we can map the carrier,
    // regardless of the original source classification.
    if (airlineUrl) {
      return { ...option, deepLink: airlineUrl };
    }

    if (option.bookingSource === "ota") {
      return { ...option, deepLink: buildOtaFallbackUrl(trip) };
    }

    const airlineSearchFallback = `https://www.google.com/search?q=${encodeURIComponent(
      `${option.airline} official flight search`,
    )}`;
    return { ...option, deepLink: airlineSearchFallback };
  });
}

async function runEndpointSearch(
  endpoint: string,
  trip: TripDetails,
  preferences: SearchPreferences,
): Promise<FlightOption[]> {
  const apiKey = process.env.NOVA_ACT_API_KEY;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ trip, preferences }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Nova Act endpoint returned ${response.status}`);
  }

  const payload = (await response.json()) as NovaActSearchResponse;
  const options = validateOptions(payload.options);

  if (options.length === 0) {
    throw new Error("Nova Act endpoint returned no valid options.");
  }

  // Pass 2 (local): enrich missing/invalid deep links with booking-site fallbacks.
  return enrichBookingLinks(options, trip);
}

export async function runNovaActSearch(
  trip: TripDetails,
  preferences: SearchPreferences,
): Promise<FlightOption[]> {
  const endpoint = process.env.NOVA_ACT_SEARCH_ENDPOINT;

  if (endpoint) {
    return runEndpointSearch(endpoint, trip, preferences);
  }

  // Dev fallback so UI keeps working until endpoint wiring is in place.
  await sleep(1800);
  return enrichBookingLinks(generateMockFlightOptions(trip, preferences), trip);
}

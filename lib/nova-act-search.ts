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

function buildAirlineBookingUrl(airline: string, trip: TripDetails): string | null {
  const normalized = normalizeAirlineName(airline);
  const from = encodeURIComponent(trip.origin);
  const to = encodeURIComponent(trip.destination);
  const date = encodeURIComponent(trip.date);

  const rules: Array<{ pattern: RegExp; url: string }> = [
    { pattern: /\bdelta\b/, url: `https://www.delta.com/flight-search/book-a-flight?origin=${from}&destination=${to}&startDate=${date}` },
    { pattern: /\bunited\b/, url: `https://www.united.com/en/us/fsr/choose-flights?f=${from}&t=${to}&d=${date}` },
    { pattern: /\bamerican\b|aa\b/, url: `https://www.aa.com/booking/find-flights?from=${from}&to=${to}&departureDate=${date}` },
    { pattern: /\bsouthwest\b/, url: `https://www.southwest.com/air/booking/select.html?originationAirportCode=${from}&destinationAirportCode=${to}&departureDate=${date}` },
    { pattern: /\bjetblue\b/, url: `https://www.jetblue.com/booking?from=${from}&to=${to}&depart=${date}` },
    { pattern: /\balaska\b/, url: `https://www.alaskaair.com/booking/flights?from=${from}&to=${to}&departureDate=${date}` },
    { pattern: /\bspirit\b/, url: `https://www.spirit.com/book?from=${from}&to=${to}&departureDate=${date}` },
    { pattern: /\bfrontier\b/, url: `https://booking.flyfrontier.com/Flight/InternalSelect?o1=${from}&d1=${to}&dd1=${date}` },
    { pattern: /\bbritish airways\b|\bba\b/, url: `https://www.britishairways.com/travel/home/public/en_us` },
    { pattern: /\blufthansa\b/, url: `https://www.lufthansa.com/us/en/homepage` },
    { pattern: /\bair france\b/, url: `https://wwws.airfrance.us/search/flights` },
    { pattern: /\bklm\b/, url: `https://www.klm.com/home/us/en` },
    { pattern: /\bemirates\b/, url: `https://www.emirates.com/us/english/book/` },
    { pattern: /\bqatar\b/, url: `https://www.qatarairways.com/en-us/book.html` },
    { pattern: /\bair canada\b/, url: `https://www.aircanada.com/home/us/en/aco/flights` },
  ];

  const match = rules.find((rule) => rule.pattern.test(normalized));
  if (match) return match.url;

  return null;
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
    if (option.deepLink && /^https?:\/\//i.test(option.deepLink)) {
      return option;
    }

    const airlineUrl = buildAirlineBookingUrl(option.airline, trip);
    if (option.bookingSource === "airline" && airlineUrl) {
      return { ...option, deepLink: airlineUrl };
    }

    if (option.bookingSource === "ota") {
      return { ...option, deepLink: buildOtaFallbackUrl(trip) };
    }

    if (airlineUrl) {
      return { ...option, deepLink: airlineUrl };
    }

    const officialSiteSearch = `https://www.google.com/search?q=${encodeURIComponent(
      `${option.airline} official booking site`,
    )}`;
    return { ...option, deepLink: officialSiteSearch };
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

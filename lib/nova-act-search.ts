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

  return options;
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
  return generateMockFlightOptions(trip, preferences);
}

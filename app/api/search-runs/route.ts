import { NextResponse } from "next/server";
import type { SearchPreferences, TripDetails } from "@/lib/types";
import { createSearchRunRecord } from "@/lib/search-runs-store";

interface CreateRunRequest {
  trip?: TripDetails;
  preferences?: SearchPreferences;
}

function isValidTrip(trip: TripDetails | undefined): trip is TripDetails {
  return Boolean(
    trip &&
      trip.origin?.trim() &&
      trip.destination?.trim() &&
      trip.date &&
      Number.isFinite(trip.passengers) &&
      trip.passengers > 0,
  );
}

function sanitizePreferences(prefs: SearchPreferences): SearchPreferences {
  return {
    priorityMode:
      prefs.priorityMode === "time" || prefs.priorityMode === "cost"
        ? prefs.priorityMode
        : "balanced",
    maxPrice:
      typeof prefs.maxPrice === "number" && Number.isFinite(prefs.maxPrice) && prefs.maxPrice > 0
        ? Math.round(prefs.maxPrice)
        : undefined,
    airlinePreference:
      typeof prefs.airlinePreference === "string" && prefs.airlinePreference.trim()
        ? prefs.airlinePreference.trim()
        : undefined,
    maxStops:
      prefs.maxStops === 0 || prefs.maxStops === 1 || prefs.maxStops === 2
        ? prefs.maxStops
        : undefined,
    cabinClass:
      prefs.cabinClass === "economy" ||
      prefs.cabinClass === "premium-economy" ||
      prefs.cabinClass === "business" ||
      prefs.cabinClass === "first" ||
      prefs.cabinClass === "any"
        ? prefs.cabinClass
        : "any",
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CreateRunRequest | null;

  if (!body || !isValidTrip(body.trip) || !body.preferences) {
    return NextResponse.json(
      { error: "Invalid request payload for search run." },
      { status: 400 },
    );
  }

  const run = createSearchRunRecord(body.trip, sanitizePreferences(body.preferences));
  return NextResponse.json(run, { status: 201 });
}

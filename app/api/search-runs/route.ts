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

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CreateRunRequest | null;

  if (!body || !isValidTrip(body.trip) || !body.preferences) {
    return NextResponse.json(
      { error: "Invalid request payload for search run." },
      { status: 400 },
    );
  }

  const run = createSearchRunRecord(body.trip, body.preferences);
  return NextResponse.json(run, { status: 201 });
}

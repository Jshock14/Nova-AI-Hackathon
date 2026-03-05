import type {
  SearchPreferences,
  SearchRun,
  TripDetails,
} from "@/lib/types";
import { generateMockFlightOptions } from "@/lib/mock-search";

// In a future backend, these would call:
// POST /search-run and GET /run/{id}

export async function createSearchRun(
  trip: TripDetails,
  preferences: SearchPreferences,
): Promise<SearchRun> {
  const now = new Date().toISOString();
  const options = generateMockFlightOptions(trip, preferences);

  const run: SearchRun = {
    id: `mock-${Date.now()}`,
    trip,
    preferences,
    status: "completed",
    options,
    createdAt: now,
    completedAt: now,
  };

  // Simulate network latency for UX realism.
  await new Promise((resolve) => setTimeout(resolve, 800));

  return run;
}

export async function getSearchRun(id: string): Promise<SearchRun | null> {
  // For the MVP mock, we don't persist runs.
  // This function exists to mirror a future GET /run/{id}.
  console.warn("getSearchRun is not implemented for mock data:", id);
  return null;
}


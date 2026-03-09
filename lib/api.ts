import type { SearchPreferences, SearchRun, TripDetails } from "@/lib/types";

export async function createSearchRun(
  trip: TripDetails,
  preferences: SearchPreferences,
): Promise<SearchRun> {
  const response = await fetch("/api/search-runs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trip, preferences }),
  });

  if (!response.ok) {
    throw new Error("Failed to create search run.");
  }

  return (await response.json()) as SearchRun;
}

export async function getSearchRun(id: string): Promise<SearchRun | null> {
  const response = await fetch(`/api/search-runs/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch search run.");
  }

  return (await response.json()) as SearchRun;
}

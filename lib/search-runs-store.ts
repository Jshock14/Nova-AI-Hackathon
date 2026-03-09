import type { SearchPreferences, SearchRun, TripDetails } from "@/lib/types";
import { runNovaActSearch } from "@/lib/nova-act-search";

const runs = new Map<string, SearchRun>();

function runId() {
  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createSearchRunRecord(
  trip: TripDetails,
  preferences: SearchPreferences,
): SearchRun {
  const now = new Date().toISOString();
  const id = runId();

  const initialRun: SearchRun = {
    id,
    trip,
    preferences,
    status: "pending",
    options: [],
    createdAt: now,
  };

  runs.set(id, initialRun);
  queueMicrotask(() => {
    void executeRun(id);
  });

  return initialRun;
}

export function getSearchRunRecord(id: string): SearchRun | null {
  return runs.get(id) ?? null;
}

async function executeRun(id: string) {
  const pendingRun = runs.get(id);
  if (!pendingRun || pendingRun.status !== "pending") return;

  runs.set(id, {
    ...pendingRun,
    status: "running",
  });

  try {
    const options = await runNovaActSearch(pendingRun.trip, pendingRun.preferences);
    const latest = runs.get(id);
    if (!latest) return;

    runs.set(id, {
      ...latest,
      status: "completed",
      options,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    const latest = runs.get(id);
    if (!latest) return;

    const message = error instanceof Error ? error.message : "Search run failed.";
    runs.set(id, {
      ...latest,
      status: "failed",
      errorMessage: message,
      completedAt: new Date().toISOString(),
    });
  }
}

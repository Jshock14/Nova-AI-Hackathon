"use client";

import { useRouter } from "next/navigation";
import type { FlightOption, RankingBadgeType } from "@/lib/types";
import { useRedirectState } from "@/app/providers/redirect-provider";
import { ResultsSidebar } from "@/components/results-sidebar";
import { ResultFlightCard } from "@/components/result-flight-card";

export default function ResultsPage() {
  const router = useRouter();
  const { tripDetails, flightOptions } = useRedirectState();

  if (!tripDetails) {
    if (typeof window !== "undefined") router.replace("/");
    return null;
  }

  const displayOptions = flightOptions.filter((option) => option.badges[0]);
  const reasons = buildReasons(displayOptions);

  return (
    <main className="flex flex-1 justify-center px-4 py-8 lg:px-20">
      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-8 lg:grid-cols-12">
        <ResultsSidebar />

        <section className="space-y-5 lg:col-span-9">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
              <span>Search</span>
              <span>/</span>
              <span className="font-semibold text-slate-900">Flight Alternatives</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-900 md:text-[30px]">
              Ranked Flight Alternatives
            </h1>
          </div>

          <div className="space-y-5">
            {displayOptions.map((option, index) => (
              <ResultFlightCard
                key={option.id}
                option={option}
                index={index}
                reason={reasons[option.id] ?? ""}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function buildReasons(options: FlightOption[]) {
  const reasonById: Record<string, string> = {};
  if (options.length === 0) return reasonById;

  const sortedByPrice = [...options].sort((a, b) => a.priceCents - b.priceCents);
  const sortedByArrival = [...options].sort(
    (a, b) => new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime(),
  );
  const sortedByDuration = [...options].sort((a, b) => a.durationMinutes - b.durationMinutes);

  const cheapest = sortedByPrice[0];
  const secondCheapest = sortedByPrice[1];
  const fastestArrival = sortedByArrival[0];
  const secondArrival = sortedByArrival[1];
  const fastestDuration = sortedByDuration[0];

  for (const option of options) {
    const badge = (option.badges[0] ?? "balanced-choice") as RankingBadgeType;

    if (badge === "best-price" && cheapest) {
      const diff = secondCheapest ? Math.max(0, secondCheapest.priceCents - option.priceCents) : 0;
      reasonById[option.id] =
        diff > 0
          ? `Why this option? $${Math.round(diff / 100)} cheaper than the next best fare.`
          : "Why this option? Tied for lowest available fare.";
      continue;
    }

    if (badge === "fastest-arrival" && fastestArrival) {
      const diffMs = secondArrival
        ? new Date(secondArrival.arrivalTime).getTime() - new Date(option.arrivalTime).getTime()
        : 0;
      const diffMinutes = Math.max(0, Math.round(diffMs / 60000));
      if (diffMinutes > 0) {
        const h = Math.floor(diffMinutes / 60);
        const m = diffMinutes % 60;
        reasonById[option.id] = `Why this option? Arrives ${h}h ${m}m earlier than the next option.`;
      } else {
        reasonById[option.id] = "Why this option? Tied for earliest arrival.";
      }
      continue;
    }

    if (badge === "alternative-hub") {
      const layover = option.layovers?.[0];
      if (layover) {
        reasonById[option.id] = `Why this option? Connection via ${layover.airport} keeps this route competitive.`;
      } else {
        reasonById[option.id] = "Why this option? Alternate hub routing improves recovery chances.";
      }
      continue;
    }

    const deltaCost = Math.max(0, option.priceCents - cheapest.priceCents);
    const deltaDuration = Math.max(0, option.durationMinutes - fastestDuration.durationMinutes);
    if (deltaCost === 0 && deltaDuration === 0) {
      reasonById[option.id] =
        "Why this option? Matches the fastest and cheapest profile in this result set.";
    } else {
      reasonById[option.id] = `Why this option? Within $${Math.round(deltaCost / 100)} of cheapest and ${deltaDuration} min of fastest duration.`;
    }
  }

  return reasonById;
}

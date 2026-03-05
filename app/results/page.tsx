"use client";

import { useRouter } from "next/navigation";
import { useRedirectState } from "@/app/providers/redirect-provider";
import { ResultsSidebar } from "@/components/results-sidebar";
import { ResultFlightCard } from "@/components/result-flight-card";
import { Icon } from "@/components/ui/icon";

export default function ResultsPage() {
  const router = useRouter();
  const { tripDetails, flightOptions } = useRedirectState();

  if (!tripDetails) {
    if (typeof window !== "undefined") router.replace("/");
    return null;
  }

  const hasResults = flightOptions.length > 0;

  return (
    <main className="flex-1 flex justify-center py-8 px-4 lg:px-20">
      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ResultsSidebar />

        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Ranked Flight Alternatives
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                Depart First
              </button>
              <button
                type="button"
                className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                Arrival First
              </button>
            </div>
          </div>

          {hasResults ? (
            <>
              <div className="space-y-6">
                {flightOptions.map((option, index) => (
                  <ResultFlightCard key={option.id} option={option} index={index} />
                ))}
              </div>
              <div className="flex flex-col items-center py-6 gap-4">
                <button
                  type="button"
                  className="text-primary font-bold text-sm flex items-center gap-2 hover:underline"
                >
                  <Icon name="expand_more" />
                  Show more flight options
                </button>
                <p className="text-xs text-text-secondary">
                  Powered by Skyscanner. All rights reserved.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-500 dark:text-slate-400 py-12">
              <p>We couldn&apos;t load options. Start a new search from the homepage.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressTracker } from "@/components/progress-tracker";
import { Icon } from "@/components/ui/icon";
import { useRedirectState } from "@/app/providers/redirect-provider";
import { createSearchRun, getSearchRun } from "@/lib/api";
import type { SearchRun } from "@/lib/types";

const TOTAL_STEPS = 4;
const POLL_MS = 2500;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function RunPage() {
  const router = useRouter();
  const {
    tripDetails,
    preferences,
    setFlightOptions,
    setSelectedOption,
    setSearchRun,
  } = useRedirectState();
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createRunPromiseRef = useRef<Promise<SearchRun> | null>(null);

  useEffect(() => {
    if (!tripDetails) {
      router.replace("/");
    }
  }, [tripDetails, router]);

  useEffect(() => {
    if (!tripDetails) return;

    let cancelled = false;

    const runSearch = async () => {
      try {
        setErrorMessage(null);
        if (!createRunPromiseRef.current) {
          createRunPromiseRef.current = createSearchRun(tripDetails, preferences);
        }
        const run = await createRunPromiseRef.current;
        if (cancelled) return;

        setSearchRun(run);
        setCurrentStep(1);

        while (!cancelled) {
          await delay(POLL_MS);
          const latestRun = await getSearchRun(run.id);
          if (!latestRun) {
            setErrorMessage("This search session expired. Please start a new search.");
            return;
          }

          setSearchRun(latestRun);
          setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));

          if (latestRun.status === "completed") {
            setFlightOptions(latestRun.options);
            setSelectedOption(latestRun.options[0] ?? null);
            router.replace("/results");
            return;
          }

          if (latestRun.status === "failed") {
            setErrorMessage(latestRun.errorMessage ?? "Search failed. Please try again.");
            return;
          }
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Search run failed", error);
        setErrorMessage("Unable to run search right now. Please try again.");
      }
    };

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [
    tripDetails,
    preferences,
    setFlightOptions,
    setSearchRun,
    setSelectedOption,
    router,
  ]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[640px] bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 md:p-12">
        <div className="flex justify-center mb-8">
          <div className="size-16 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
            <Icon name="search" size={40} className="text-sky-600 dark:text-sky-400" />
          </div>
        </div>
        <h1 className="text-slate-900 dark:text-slate-100 tracking-tight text-2xl md:text-3xl font-bold leading-tight text-center pb-8">
          Searching every airline for the best options...
        </h1>

        <ProgressTracker currentStepIndex={currentStep} />

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          {errorMessage ? (
            <div className="space-y-4">
              <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => router.replace("/")}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Back to search
              </button>
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              This could take a few moments. Hang tight!
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

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
  const { tripDetails, preferences, setFlightOptions, setSelectedOption, setSearchRun } =
    useRedirectState();

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
  }, [tripDetails, preferences, setFlightOptions, setSearchRun, setSelectedOption, router]);

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 md:py-14">
      <div className="w-full max-w-[640px] rounded-xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <div className="mb-8 flex justify-center">
          <span className="flex size-24 items-center justify-center rounded-full bg-sky-100 text-sky-500 shadow-sm">
            <Icon name="manage_search" size={52} />
          </span>
        </div>

        {errorMessage ? (
          <div className="space-y-5 text-center">
            <p className="text-base text-red-600">{errorMessage}</p>
            <button
              type="button"
              onClick={() => router.replace("/")}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Back to search
            </button>
          </div>
        ) : (
          <ProgressTracker currentStepIndex={currentStep} />
        )}
      </div>

      <p className="mt-10 text-sm text-slate-500">Live availability checks in progress.</p>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressTracker } from "@/components/progress-tracker";
import { Icon } from "@/components/ui/icon";
import { useRedirectState } from "@/app/providers/redirect-provider";
import { createSearchRun } from "@/lib/api";

const TOTAL_STEPS = 4;

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

  useEffect(() => {
    if (!tripDetails) {
      router.replace("/");
    }
  }, [tripDetails, router]);

  useEffect(() => {
    if (!tripDetails) return;

    let cancelled = false;

    const runSearch = async () => {
      const run = await createSearchRun(tripDetails, preferences);
      if (cancelled) return;
      setSearchRun(run);
      setFlightOptions(run.options);
      setSelectedOption(run.options[0] ?? null);
    };

    runSearch().catch((error) => {
      console.error("Mock search failed", error);
    });

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= TOTAL_STEPS - 1) {
          clearInterval(interval);
          setTimeout(() => {
            if (!cancelled) router.replace("/results");
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    return () => {
      cancelled = true;
      clearInterval(interval);
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
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            This could take a few moments. Hang tight!
          </p>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRedirectState } from "@/app/providers/redirect-provider";

export default function BookingPage() {
  const router = useRouter();
  const { selectedOption } = useRedirectState();

  if (selectedOption && typeof window !== "undefined") {
    router.replace(`/results/${selectedOption.id}`);
    return null;
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          Booking (coming soon)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Select a flight from the results page to see journey details and continue to the
          airline&apos;s site.
        </p>
        <Link href="/results" className="text-primary font-medium hover:underline">
          View flight alternatives →
        </Link>
      </div>
    </main>
  );
}

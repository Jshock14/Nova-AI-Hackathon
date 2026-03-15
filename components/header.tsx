"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export type HeaderVariant = "landing" | "run" | "results" | "details";

const LABELS: Record<HeaderVariant, string> = {
  landing: "Recovery Search",
  run: "Searching Live Options",
  results: "Ranked Alternatives",
  details: "Flight Details",
};

export function Header({ variant }: { variant: HeaderVariant }) {
  const pathname = usePathname();
  const isDetails = pathname?.startsWith("/results/") && pathname !== "/results";
  const resolvedVariant: HeaderVariant = isDetails ? "details" : variant;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-[6px]">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 text-primary">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-white">
            <Icon name="flight_takeoff" size={14} />
          </span>
          <span className="text-xl font-bold tracking-[-0.02em]">Redirect</span>
        </Link>

        <p className="text-sm font-medium text-slate-600">{LABELS[resolvedVariant]}</p>
      </div>
    </header>
  );
}

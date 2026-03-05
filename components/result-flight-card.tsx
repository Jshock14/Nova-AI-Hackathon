"use client";

import Link from "next/link";
import type { FlightOption, RankingBadgeType } from "@/lib/types";
import { Icon } from "@/components/ui/icon";

const BADGE_CONFIG: Record<
  RankingBadgeType,
  { label: string; className: string }
> = {
  "best-price": {
    label: "Best Price",
    className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  },
  "fastest-arrival": {
    label: "Best Arrival Time",
    className: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
  },
  "balanced-choice": {
    label: "Balanced Choice",
    className: "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  },
  "alternative-hub": {
    label: "Alternative Hub",
    className: "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  },
};

interface ResultFlightCardProps {
  option: FlightOption;
  index: number;
}

export function ResultFlightCard({ option, index }: ResultFlightCardProps) {
  const depart = new Date(option.departureTime);
  const arrive = new Date(option.arrivalTime);
  const layover = option.layovers?.[0];
  const primaryBadge = option.badges[0];
  const badgeConfig = primaryBadge ? BADGE_CONFIG[primaryBadge] : null;
  const priceDollars = (option.priceCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const isFirst = index === 0;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm ${
        isFirst
          ? "border-2 border-primary"
          : "border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
      }`}
    >
      {isFirst && badgeConfig && (
        <div className="px-6 py-2 bg-green-100 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800">
          <span className={`text-xs font-bold uppercase tracking-wider ${badgeConfig.className}`}>
            {badgeConfig.label}
          </span>
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4 md:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {depart.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false })}
              </p>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {option.departureAirport}
              </span>
            </div>
            {layover && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Icon name="flight" size={18} />
                <span className="text-sm">
                  {Math.floor(layover.durationMinutes / 60)}h {layover.durationMinutes % 60}m
                </span>
                <span className="text-sm font-medium">{layover.airport}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {arrive.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false })}
              </p>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {option.arrivalAirport}
              </span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-between md:justify-end gap-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {priceDollars}
            </p>
            <Link
              href={`/results/${option.id}`}
              className="bg-primary text-white font-bold py-2.5 px-5 rounded-lg hover:bg-primary/90 transition-all inline-flex items-center justify-center text-sm whitespace-nowrap"
            >
              {isFirst ? "Continue Booking" : "View Alternative"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

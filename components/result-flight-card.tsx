"use client";

import Link from "next/link";
import type { FlightOption, RankingBadgeType } from "@/lib/types";
import { Icon } from "@/components/ui/icon";

const BADGE_CONFIG: Record<RankingBadgeType, { label: string; tone: string }> = {
  "best-price": {
    label: "Best Price",
    tone: "bg-green-100 text-green-700",
  },
  "fastest-arrival": {
    label: "Best Arrival Time",
    tone: "bg-sky-100 text-sky-700",
  },
  "balanced-choice": {
    label: "Balanced Choice",
    tone: "bg-slate-200 text-slate-600",
  },
  "alternative-hub": {
    label: "Alternative Hub",
    tone: "bg-slate-200 text-slate-600",
  },
};

interface ResultFlightCardProps {
  option: FlightOption;
  index: number;
  reason: string;
}

function hhmm(iso: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(new Date(iso));
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const period = parts.find((p) => p.type === "dayPeriod")?.value ?? "";
  return {
    main: `${hour}:${minute}`,
    period,
  };
}

function durationLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}H ${m}M`;
}

export function ResultFlightCard({ option, index, reason }: ResultFlightCardProps) {
  const primaryBadge = option.badges[0];
  if (!primaryBadge) {
    return null;
  }
  const badge = BADGE_CONFIG[primaryBadge];
  const priceDollars = Math.round(option.priceCents / 100);
  const stopLabel =
    option.stops === 0 ? "DIRECT" : `${option.stops} STOP${option.stops > 1 ? "S" : ""}`;
  const depart = hhmm(option.departureTime);
  const arrive = hhmm(option.arrivalTime);
  const arrivesNextDay =
    new Date(option.arrivalTime).toDateString() !==
    new Date(option.departureTime).toDateString();

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
        index === 0 ? "border-2 border-primary" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-2 text-xs text-slate-600">
        <span className={`rounded-full px-2 py-1 font-bold uppercase tracking-[0.05em] ${badge.tone}`}>
          {badge.label}
        </span>
        <span className="hidden items-center gap-2 md:flex">
          <Icon name="info" size={12} />
          <span className="font-semibold">{reason}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 items-center gap-5 p-6 lg:grid-cols-[110px_1fr_220px]">
        <div className="border-b border-slate-100 pb-4 text-center lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Icon name="flight" size={26} />
          </div>
          <p className="text-xs font-bold uppercase text-slate-500">{option.airline}</p>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div>
            <p className="text-4xl font-bold tracking-[-0.02em] text-slate-900 md:text-[36px]">
              {depart.main}
              <span className="ml-1 text-xs font-semibold tracking-normal text-slate-500">
                {depart.period}
              </span>
            </p>
            <p className="text-sm font-medium text-slate-500">{option.departureAirport}</p>
          </div>

          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-500">{durationLabel(option.durationMinutes)}</p>
            <div className="relative mt-2 h-[2px] w-40 bg-slate-200">
              <span className="absolute -left-1 -top-[3px] size-2 rounded-full bg-slate-300" />
              <span className="absolute -right-1 -top-[3px] size-2 rounded-full bg-slate-300" />
              <span className="absolute left-1/2 top-[-4px] size-2 -translate-x-1/2 rounded-full bg-primary" />
            </div>
            <p
              className={`mt-2 text-[10px] font-bold ${
                option.stops > 0 ? "text-orange-500" : "text-green-600"
              }`}
            >
              {stopLabel}
            </p>
          </div>

          <div className="text-right">
            <p className="text-4xl font-bold tracking-[-0.02em] text-slate-900 md:text-[36px]">
              {arrive.main}
              <span className="ml-1 text-xs font-semibold tracking-normal text-slate-500">
                {arrive.period}
              </span>
            </p>
            <p className="text-sm font-medium text-slate-500">
              {option.arrivalAirport}
              {arrivesNextDay ? " +1" : ""}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-right text-sm text-slate-500">From</p>
          <p className="text-right text-4xl font-extrabold tracking-[-0.02em] text-primary">${priceDollars}</p>
          <Link
            href={`/results/${option.id}`}
            className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-6 py-4 text-center text-lg font-bold text-white hover:bg-primary/90"
          >
            Continue to Booking
            <Icon name="arrow_forward" size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

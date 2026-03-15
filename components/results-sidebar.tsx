"use client";

import { useRedirectState } from "@/app/providers/redirect-provider";
import { Icon } from "@/components/ui/icon";

export function ResultsSidebar() {
  const { tripDetails } = useRedirectState();
  if (!tripDetails) return null;

  const dateFormatted = tripDetails.date
    ? new Date(`${tripDetails.date}T12:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

  return (
    <aside className="space-y-5 lg:col-span-3">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-bold tracking-[-0.02em] text-slate-900">Your Search</h3>

        <div className="space-y-4 pb-1 text-sm">
          <div className="flex items-start gap-3">
            <Icon name="flight_takeoff" className="mt-1 text-slate-500" size={16} />
            <div>
              <p className="text-xs text-slate-500">From</p>
              <p className="font-semibold text-slate-900">{tripDetails.origin || "-"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="flight_land" className="mt-1 text-slate-500" size={16} />
            <div>
              <p className="text-xs text-slate-500">To</p>
              <p className="font-semibold text-slate-900">{tripDetails.destination || "-"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="calendar_today" className="mt-1 text-slate-500" size={16} />
            <div>
              <p className="text-xs text-slate-500">Date</p>
              <p className="font-semibold text-slate-900">{dateFormatted}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="person" className="mt-1 text-slate-500" size={16} />
            <div>
              <p className="text-xs text-slate-500">Passengers</p>
              <p className="font-semibold text-slate-900">{tripDetails.passengers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-white shadow-lg">
        <h4 className="text-xl font-bold tracking-[-0.01em]">Recovery Mode Active</h4>
        <p className="mt-3 text-xs leading-6 text-white/85">
          Ranking is focused on fastest workable recovery based on your selected constraints.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm font-bold">
          <span className="size-2 rounded-full bg-green-400" />
          Live availability monitoring
        </div>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { useRedirectState } from "@/app/providers/redirect-provider";
import { Icon } from "@/components/ui/icon";

export function ResultsSidebar() {
  const { tripDetails } = useRedirectState();

  if (!tripDetails) return null;

  const dateFormatted = tripDetails.date
    ? new Date(tripDetails.date + "T12:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <aside className="lg:col-span-3 flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">Your Search</h3>
        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {tripDetails.origin || "—"} &gt; {tripDetails.destination || "—"}
          </p>
          <p>{dateFormatted}</p>
          <p>{tripDetails.passengers} Passenger{tripDetails.passengers !== 1 ? "s" : ""}</p>
        </div>
        <hr className="my-6 border-slate-100 dark:border-slate-800" />
        <div className="space-y-3">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100 text-sm py-1">
              Stops
              <Icon name="expand_more" className="text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="stops" defaultChecked className="accent-primary" />
                1 stop
              </label>
            </div>
          </details>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100 text-sm py-1">
              Airlines
              <Icon name="expand_more" className="text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" defaultChecked className="accent-primary rounded" />
                United Airlines
              </label>
            </div>
          </details>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100 text-sm py-1">
              Departure Time
              <Icon name="expand_more" className="text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
          </details>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100 text-sm py-1">
              Arrival Time
              <Icon name="expand_more" className="text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
          </details>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100 text-sm py-1">
              Price Range
              <Icon name="expand_more" className="text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pt-2">
              <input type="range" min={0} max={1000} className="w-full accent-primary" />
            </div>
          </details>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100 text-sm py-1">
              Max Duration
              <Icon name="expand_more" className="text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
          </details>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100 text-sm py-1">
              Amenities
              <Icon name="expand_more" className="text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" className="accent-primary rounded" />
                Wi-Fi
              </label>
            </div>
          </details>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100 text-sm py-1">
              Cabin Class
              <Icon name="expand_more" className="text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" defaultChecked className="accent-primary rounded" />
                Economy
              </label>
            </div>
          </details>
        </div>
      </div>

      <div className="bg-primary text-white p-6 rounded-xl shadow-lg">
        <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Download our app</h4>
        <p className="text-xs opacity-90 leading-relaxed">
          Get exclusive alerts and new flight availability first.
        </p>
      </div>
    </aside>
  );
}

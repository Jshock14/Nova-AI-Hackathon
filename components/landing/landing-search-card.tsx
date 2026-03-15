"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useRedirectState } from "@/app/providers/redirect-provider";
import { Icon } from "@/components/ui/icon";
import type { SearchPreferences } from "@/lib/types";

export function LandingSearchCard() {
  const router = useRouter();
  const {
    tripDetails,
    preferences,
    setTripDetails,
    setPreferences,
    setFlightOptions,
    setSelectedOption,
  } = useRedirectState();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const currentTrip = useMemo(
    () =>
      tripDetails ?? {
        origin: "",
        destination: "",
        date: "",
        passengers: 1,
      },
    [tripDetails],
  );

  const currentPreferences: SearchPreferences = {
    priorityMode: preferences.priorityMode ?? "balanced",
    maxStops: preferences.maxStops,
    cabinClass: preferences.cabinClass ?? "any",
    maxPrice: preferences.maxPrice,
    airlinePreference: preferences.airlinePreference,
  };

  const updatePreferences = (patch: Partial<SearchPreferences>) => {
    setPreferences({ ...currentPreferences, ...patch });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentTrip.origin.trim() || !currentTrip.destination.trim() || !currentTrip.date) {
      setError("Origin, destination, and departure date are required.");
      return;
    }

    setSubmitting(true);
    setTripDetails(currentTrip);
    setFlightOptions([]);
    setSelectedOption(null);
    router.push("/run");
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="w-full max-w-[896px] rounded-3xl border border-slate-100 bg-white p-8 shadow-[0px_25px_50px_-12px_rgba(226,232,240,1)]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FieldLabel label="Origin" icon="flight_takeoff">
            <input
              type="text"
              value={currentTrip.origin}
              onChange={(e) =>
                setTripDetails({ ...currentTrip, origin: e.target.value.toUpperCase() })
              }
              className="h-14 w-full rounded-xl border border-transparent bg-slate-50 pl-10 pr-4 text-base font-medium text-slate-700 placeholder:text-slate-400 focus:border-primary/25 focus:ring-2 focus:ring-primary/20"
              placeholder="SFO"
            />
          </FieldLabel>

          <FieldLabel label="Destination" icon="flight_land">
            <input
              type="text"
              value={currentTrip.destination}
              onChange={(e) =>
                setTripDetails({ ...currentTrip, destination: e.target.value.toUpperCase() })
              }
              className="h-14 w-full rounded-xl border border-transparent bg-slate-50 pl-10 pr-4 text-base font-medium text-slate-700 placeholder:text-slate-400 focus:border-primary/25 focus:ring-2 focus:ring-primary/20"
              placeholder="JFK"
            />
          </FieldLabel>

          <FieldLabel label="Departure Date" icon="calendar_today">
            <input
              type="date"
              value={currentTrip.date}
              onChange={(e) => setTripDetails({ ...currentTrip, date: e.target.value })}
              min={today}
              className="h-14 w-full rounded-xl border border-transparent bg-slate-50 pl-10 pr-4 text-base font-medium text-slate-700 focus:border-primary/25 focus:ring-2 focus:ring-primary/20"
            />
          </FieldLabel>

          <FieldLabel label="Passengers" icon="person">
            <select
              value={currentTrip.passengers}
              onChange={(e) => setTripDetails({ ...currentTrip, passengers: Number(e.target.value) })}
              className="h-14 w-full appearance-none rounded-xl border border-transparent bg-slate-50 pl-10 pr-4 text-base font-medium text-slate-700 focus:border-primary/25 focus:ring-2 focus:ring-primary/20"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Adult" : "Passengers"}
                </option>
              ))}
            </select>
          </FieldLabel>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-800"
          >
            <Icon name="tune" size={16} />
            Advanced Preferences
            <Icon
              name={advancedOpen ? "expand_less" : "expand_more"}
              size={18}
              className="text-slate-500"
            />
          </button>

          {advancedOpen ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500">
                      Max Budget
                    </label>
                    <span className="text-sm font-bold text-primary">
                      {typeof currentPreferences.maxPrice === "number"
                        ? `$${currentPreferences.maxPrice.toLocaleString()}`
                        : "No limit"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={3000}
                    step={50}
                    value={currentPreferences.maxPrice ?? 1200}
                    onChange={(e) => updatePreferences({ maxPrice: Number(e.target.value) })}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-primary"
                  />
                  <button
                    type="button"
                    onClick={() => updatePreferences({ maxPrice: undefined })}
                    className="mt-2 text-xs font-medium text-slate-500 hover:text-slate-700"
                  >
                    Clear budget limit
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500">
                    Preferred Airline
                  </label>
                  <input
                    type="text"
                    value={currentPreferences.airlinePreference ?? ""}
                    onChange={(e) =>
                      updatePreferences({
                        airlinePreference: e.target.value.trim() || undefined,
                      })
                    }
                    placeholder="Any Airline"
                    className="h-12 w-full rounded-xl border border-transparent bg-slate-50 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-primary/25 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500">
                    Search Priority
                  </label>
                  <div className="flex rounded-xl bg-slate-100 p-1">
                    {[
                      { id: "time", label: "Time" },
                      { id: "balanced", label: "Balanced" },
                      { id: "cost", label: "Cost" },
                    ].map((item) => {
                      const active = currentPreferences.priorityMode === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            updatePreferences({
                              priorityMode: item.id as SearchPreferences["priorityMode"],
                            })
                          }
                          className={`flex-1 rounded-lg px-2 py-2 text-[11px] font-bold ${
                            active ? "bg-white text-primary shadow-sm" : "text-slate-500"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-[max-content_max-content] md:justify-start md:gap-10">
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500">
                    Max Stops
                  </label>
                  <div className="flex justify-start">
                    <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
                    {[
                      { value: "any", label: "Any" },
                      { value: "0", label: "0" },
                      { value: "1", label: "1" },
                      { value: "2", label: "2" },
                    ].map((item) => {
                      const currentValue =
                        currentPreferences.maxStops === undefined
                          ? "any"
                          : String(currentPreferences.maxStops);
                      const active = currentValue === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() =>
                            updatePreferences({
                              maxStops:
                                item.value === "any"
                                  ? undefined
                                  : (Number(item.value) as 0 | 1 | 2),
                            })
                          }
                          className={`shrink-0 rounded-lg px-3 py-2 text-sm font-bold ${
                            active ? "bg-white text-primary shadow-sm" : "text-slate-500"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500">
                    Cabin Class
                  </label>
                  <div className="flex justify-start">
                    <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
                    {[
                      { value: "any", label: "Any" },
                      { value: "economy", label: "Economy" },
                      { value: "premium-economy", label: "Premium" },
                      { value: "business", label: "Business" },
                      { value: "first", label: "First" },
                    ].map((item) => {
                      const active = (currentPreferences.cabinClass ?? "any") === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() =>
                            updatePreferences({
                              cabinClass: item.value as SearchPreferences["cabinClass"],
                            })
                          }
                          className={`shrink-0 rounded-lg px-3 py-2 text-[11px] font-bold ${
                            active ? "bg-white text-primary shadow-sm" : "text-slate-500"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex justify-center pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 min-w-[244px] items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white shadow-[0px_10px_15px_-3px_rgba(31,58,96,0.2)] transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Searching..." : "Find Recovery Flights"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldLabel({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-left">
      <span className="mb-2 block pl-1 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500">
        {label}
      </span>
      <div className="relative">
        <Icon
          name={icon}
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        {children}
      </div>
    </label>
  );
}

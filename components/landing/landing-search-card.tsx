"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useRedirectState } from "@/app/providers/redirect-provider";
import { Icon } from "@/components/ui/icon";

export function LandingSearchCard() {
  const router = useRouter();
  const {
    tripDetails,
    setTripDetails,
    setFlightOptions,
    setSelectedOption,
  } = useRedirectState();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [maxLayoverHours, setMaxLayoverHours] = useState(8);
  const [arrivalDate, setArrivalDate] = useState("");
  const [cabinClass, setCabinClass] = useState<"economy" | "first">("economy");

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!currentTrip.origin?.trim() || !currentTrip.destination?.trim() || !currentTrip.date) {
      setError("Origin, destination, and date are required.");
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
    <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none p-6 md:p-8 border border-slate-100 dark:border-slate-800">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col text-left">
            <label className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5 ml-1">
              From
            </label>
            <div className="relative group">
              <Icon
                name="flight_takeoff"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary pointer-events-none"
              />
              <input
                type="text"
                value={currentTrip.origin}
                onChange={(e) =>
                  setTripDetails({ ...currentTrip, origin: e.target.value.toUpperCase() })
                }
                className="w-full pl-10 pr-4 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 font-medium transition-all"
                placeholder="From"
              />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <label className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5 ml-1">
              To
            </label>
            <div className="relative group">
              <Icon
                name="flight_land"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary pointer-events-none"
              />
              <input
                type="text"
                value={currentTrip.destination}
                onChange={(e) =>
                  setTripDetails({ ...currentTrip, destination: e.target.value.toUpperCase() })
                }
                className="w-full pl-10 pr-4 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 font-medium transition-all"
                placeholder="To"
              />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <label className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5 ml-1">
              Depart Date
            </label>
            <div className="relative group">
              <Icon
                name="calendar_today"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary pointer-events-none"
              />
              <input
                type="date"
                value={currentTrip.date}
                onChange={(e) => setTripDetails({ ...currentTrip, date: e.target.value })}
                min={today}
                className="w-full pl-10 pr-4 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-white placeholder:text-slate-400 font-medium transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <label className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5 ml-1">
              Passengers
            </label>
            <div className="relative group">
              <Icon
                name="person"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary pointer-events-none"
              />
              <select
                value={currentTrip.passengers}
                onChange={(e) =>
                  setTripDetails({ ...currentTrip, passengers: Number(e.target.value) })
                }
                className="w-full pl-10 pr-4 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-white font-medium transition-all appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            type="button"
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium text-sm mb-4"
          >
            Advanced Preferences
            <Icon
              name={advancedOpen ? "expand_less" : "expand_more"}
              className="text-slate-500"
            />
          </button>
          {advancedOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pb-4">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                    Max Layover
                  </label>
                  <span className="text-primary font-semibold text-sm">
                    {maxLayoverHours} hrs
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={maxLayoverHours}
                  onChange={(e) => setMaxLayoverHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-primary"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-2">
                  Arrival Date
                </label>
                <input
                  type="date"
                  value={arrivalDate || currentTrip.date}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  min={today}
                  className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-white font-medium"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-2">
                  Cabin Class
                </label>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg gap-1">
                  {(["economy", "first"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCabinClass(c)}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md capitalize transition-colors ${
                        cabinClass === c
                          ? "bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8">
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-primary text-white rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {submitting ? "Searching…" : "Find Recovery Flights"}
          </button>
        </div>
      </form>
    </div>
  );
}

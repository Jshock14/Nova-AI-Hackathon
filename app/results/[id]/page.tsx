"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useRedirectState } from "@/app/providers/redirect-provider";
import { Icon } from "@/components/ui/icon";
import { FlightTimeline } from "@/components/flight-timeline";
import { PriceBreakdown } from "@/components/price-breakdown";
import { AmenitiesCard } from "@/components/amenities-card";

export default function FlightDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;
  const { flightOptions } = useRedirectState();

  const flight = id ? flightOptions.find((o) => o.id === id) : null;

  if (!id || !flight) {
    if (typeof window !== "undefined") router.replace("/results");
    return null;
  }

  return (
    <main className="mx-auto flex flex-col max-w-[1200px] w-full flex-1 py-8 px-6 lg:px-10">
      <nav className="flex items-center gap-2 mb-6 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <Icon name="chevron_right" size={14} />
        <Link href="/results" className="hover:text-primary transition-colors">
          Search Results
        </Link>
        <Icon name="chevron_right" size={14} />
        <span className="text-slate-900 dark:text-slate-100 font-medium">Flight Details</span>
      </nav>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight tracking-tight">
          Flight Journey Details
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Review your itinerary in detail and add any preferences before booking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="size-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <Icon name="flight" size={48} className="text-primary" />
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-2">
                  {flight.airline} {flight.airlineCode}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                  Departure: {flight.departureAirport} &gt; {flight.arrivalAirport}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  {flight.departureTime
                    ? new Date(flight.departureTime).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}{" "}
                  • 1 Passenger
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Re-booking Policies
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Aircraft Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-6">
              Flight Schedule
            </h4>
            <FlightTimeline flight={flight} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-4">
              Fare Breakdown
            </h4>
            <PriceBreakdown priceCents={flight.priceCents} />
            <button
              type="button"
              className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
            >
              Confirm &amp; Book Now
            </button>
            <Link
              href="/results"
              className="w-full text-center text-slate-500 hover:text-primary font-medium text-sm transition-colors py-3 block"
            >
              Back to options
            </Link>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <Icon name="info" className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  You will be redirected to the airline&apos;s official site to complete payment.
                  Your flight details are already synced for a faster checkout.
                </p>
              </div>
            </div>
          </div>

          <AmenitiesCard />
        </div>
      </div>
    </main>
  );
}

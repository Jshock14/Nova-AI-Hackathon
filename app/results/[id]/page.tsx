"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useRedirectState } from "@/app/providers/redirect-provider";
import { Icon } from "@/components/ui/icon";
import { FlightTimeline } from "@/components/flight-timeline";
import { PriceBreakdown } from "@/components/price-breakdown";

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
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 py-8 lg:px-10">
      <nav className="mb-5 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/results" className="hover:text-primary">
          Search Results
        </Link>
        <Icon name="chevron_right" size={14} />
        <span className="font-semibold text-slate-900">Flight Details</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-900 md:text-[36px]">
          Flight Journey Details
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Review your selected itinerary and price breakdown before proceeding.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex gap-6">
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <Icon name="flight" size={44} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-3xl font-bold tracking-[-0.02em] text-slate-900 md:text-[34px]">
                    {flight.airline} {flight.airlineCode}
                  </h3>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold uppercase tracking-[0.05em] text-green-700">
                    Available
                  </span>
                </div>
                <p className="text-base text-slate-600">{flight.aircraftType ?? "Economy Class"}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary">
                  <Icon name="verified" size={14} />
                  Booking Source: Direct with {flight.airline}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h4 className="mb-6 text-2xl font-bold tracking-[-0.02em] text-slate-900">Flight Timeline</h4>
            <FlightTimeline flight={flight} />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-2xl font-bold tracking-[-0.02em] text-slate-900">Price Breakdown</h4>
            <PriceBreakdown priceCents={flight.priceCents} />

            {flight.deepLink ? (
              <a
                href={flight.deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-5 py-4 text-center text-lg font-bold text-white shadow-[0px_10px_15px_-3px_rgba(31,58,96,0.2)] hover:bg-primary/90"
              >
                Continue booking on airline site
                <Icon name="open_in_new" size={14} />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-slate-200 px-5 py-4 text-sm font-bold text-slate-500"
              >
                Booking link unavailable
              </button>
            )}

            <Link
              href="/results"
              className="mt-4 block text-center text-sm font-medium text-slate-500 hover:text-primary"
            >
              Back to options
            </Link>

            <div className="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-500">
              <div className="flex items-start gap-3">
                <Icon name="info" size={16} className="mt-0.5 text-slate-400" />
                <p>
                  You will be redirected to the airline&apos;s official site to complete payment. Your
                  flight details are already synced for a faster checkout.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

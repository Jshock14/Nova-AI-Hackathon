"use client";

import { useRedirectState } from "@/app/providers/redirect-provider";
import { Button } from "@/components/ui/button";

export function SelectedFlightDetails() {
  const { selectedOption, tripDetails } = useRedirectState();

  if (!selectedOption) {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-2 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Flight details</p>
        <p>Select a flight to see layovers, aircraft, and booking source.</p>
        {tripDetails && (
          <p className="text-xs">
            Route: {tripDetails.origin || "—"} →{" "}
            {tripDetails.destination || "—"}
          </p>
        )}
      </div>
    );
  }

  const depart = new Date(selectedOption.departureTime);
  const arrive = new Date(selectedOption.arrivalTime);
  const durationHours = Math.floor(selectedOption.durationMinutes / 60);
  const durationMinutes = selectedOption.durationMinutes % 60;

  const priceDollars = (selectedOption.priceCents / 100).toLocaleString(
    "en-US",
    { style: "currency", currency: "USD" },
  );

  return (
    <div className="flex h-full flex-col justify-between gap-3 text-sm">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Selected option
          </p>
          <p className="text-base font-semibold">
            {selectedOption.airline} · {priceDollars}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedOption.bookingSource === "airline"
              ? "Book directly with airline"
              : "Book via online travel agency"}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-lg font-semibold leading-tight">
                {depart.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedOption.departureAirport}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {durationHours}h {durationMinutes}m ·{" "}
              {selectedOption.stops === 0
                ? "Nonstop"
                : `${selectedOption.stops} stop${selectedOption.stops > 1 ? "s" : ""}`}
            </span>
            <div className="text-right">
              <p className="text-lg font-semibold leading-tight">
                {arrive.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedOption.arrivalAirport}
              </p>
            </div>
          </div>
        </div>

        {selectedOption.layovers && selectedOption.layovers.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Layovers
            </p>
            <ul className="space-y-0.5 text-xs text-muted-foreground">
              {selectedOption.layovers.map((layover) => (
                <li key={layover.airport}>
                  {layover.airport} · {Math.round(layover.durationMinutes / 60)}h
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedOption.aircraftType && (
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">
              Aircraft
            </p>
            <p className="text-xs">{selectedOption.aircraftType}</p>
          </div>
        )}
      </div>

      <Button type="button" className="w-full">
        Continue to booking
      </Button>
    </div>
  );
}


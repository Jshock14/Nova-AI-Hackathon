import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FlightOption } from "@/lib/types";

interface FlightDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flight: FlightOption | null;
}

export function FlightDetailsModal({
  open,
  onOpenChange,
  flight,
}: FlightDetailsModalProps) {
  if (!flight) return null;

  const depart = new Date(flight.departureTime);
  const arrive = new Date(flight.arrivalTime);
  const priceDollars = (flight.priceCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {flight.airline} · {priceDollars}
          </DialogTitle>
          <DialogDescription>
            Detailed timings, layovers, aircraft, and booking source.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-base font-semibold">
                {depart.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {flight.departureAirport}
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold">
                {arrive.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {flight.arrivalAirport}
              </p>
            </div>
          </div>

          {flight.layovers && flight.layovers.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Layovers
              </p>
              <ul className="space-y-0.5 text-xs text-muted-foreground">
                {flight.layovers.map((layover) => (
                  <li key={layover.airport}>
                    {layover.airport} ·{" "}
                    {Math.round(layover.durationMinutes / 60)}h
                  </li>
                ))}
              </ul>
            </div>
          )}

          {flight.aircraftType && (
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                Aircraft
              </p>
              <p className="text-xs">{flight.aircraftType}</p>
            </div>
          )}

          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">
              Booking source
            </p>
            <p className="text-xs">
              {flight.bookingSource === "airline"
                ? "This option is booked directly with the airline."
                : "This option is booked via an online travel agency."}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="button">Continue booking</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


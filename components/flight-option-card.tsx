import { Button } from "@/components/ui/button";
import type { FlightOption } from "@/lib/types";
import { RankingBadge } from "@/components/ranking-badge";

interface FlightOptionCardProps {
  option: FlightOption;
  onSelect: () => void;
  onViewDetails: () => void;
  isSelected?: boolean;
}

export function FlightOptionCard({
  option,
  onSelect,
  onViewDetails,
  isSelected,
}: FlightOptionCardProps) {
  const depart = new Date(option.departureTime);
  const arrive = new Date(option.arrivalTime);
  const durationHours = Math.floor(option.durationMinutes / 60);
  const durationMinutes = option.durationMinutes % 60;
  const priceDollars = (option.priceCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <article
      className={[
        "flex flex-col gap-3 rounded-xl border p-3 text-sm transition-colors",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/60",
      ].join(" ")}
      onClick={onSelect}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground">
            {option.airline} · {option.airlineCode}
          </p>
          <p className="text-lg font-semibold">{priceDollars}</p>
          <p className="text-[11px] text-muted-foreground">
            {option.bookingSource === "airline"
              ? "Book with airline"
              : "Book via OTA"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="flex items-baseline gap-2">
            <div>
              <p className="text-base font-semibold leading-tight">
                {depart.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {option.departureAirport}
              </p>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {durationHours}h {durationMinutes}m
            </span>
            <div className="text-right">
              <p className="text-base font-semibold leading-tight">
                {arrive.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {option.arrivalAirport}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {option.stops === 0
              ? "Nonstop"
              : `${option.stops} stop${option.stops > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {option.badges.map((badge) => (
            <RankingBadge key={badge} type={badge} />
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            Continue to booking
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            View details
          </Button>
        </div>
      </div>
    </article>
  );
}


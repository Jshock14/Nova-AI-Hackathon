import type { FlightOption } from "@/lib/types";
import { Icon } from "@/components/ui/icon";

interface FlightTimelineProps {
  flight: FlightOption;
}

function timeLabel(dateIso: string) {
  return new Date(dateIso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function FlightTimeline({ flight }: FlightTimelineProps) {
  const layover = flight.layovers?.[0];
  const arrivesNextDay =
    new Date(flight.arrivalTime).toDateString() !==
    new Date(flight.departureTime).toDateString();

  return (
    <div className="space-y-4">
      <TimelineRow
        icon="flight_takeoff"
        iconClass="bg-primary/10 text-primary"
        airport={`${flight.departureAirport}`}
        detail="Departure"
        right={timeLabel(flight.departureTime)}
        subtitle="Departure"
      />

      {layover ? (
        <TimelineLayover
          airport={layover.airport}
          durationMinutes={layover.durationMinutes}
          right={new Date(new Date(flight.departureTime).getTime() + (flight.durationMinutes - layover.durationMinutes) * 60_000).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        />
      ) : null}

      <TimelineRow
        icon="flight_land"
        iconClass="bg-primary text-white"
        airport={`${flight.arrivalAirport}`}
        detail="Arrival"
        right={`${timeLabel(flight.arrivalTime)}${arrivesNextDay ? " +1" : ""}`}
        subtitle="Arrival"
        end
      />
    </div>
  );
}

function TimelineRow({
  icon,
  iconClass,
  airport,
  detail,
  right,
  subtitle,
  end,
}: {
  icon: string;
  iconClass: string;
  airport: string;
  detail: string;
  right: string;
  subtitle: string;
  end?: boolean;
}) {
  return (
    <div className="grid grid-cols-[32px_1fr] gap-4">
      <div className="flex flex-col items-center">
        <span className={`flex size-8 items-center justify-center rounded-full ${iconClass}`}>
          <Icon name={icon} size={16} />
        </span>
        {end ? null : <span className="mt-1 h-16 border-l-2 border-dashed border-slate-200" />}
      </div>

      <div className="pt-0.5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-bold tracking-[-0.01em] text-slate-900">{airport}</p>
            <p className="text-sm text-slate-500">{detail}</p>
          </div>
          <p className="text-2xl font-bold tracking-[-0.01em] text-slate-900">{right}</p>
        </div>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function TimelineLayover({
  airport,
  durationMinutes,
  right,
}: {
  airport: string;
  durationMinutes: number;
  right: string;
}) {
  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;

  return (
    <div className="grid grid-cols-[32px_1fr] gap-4">
      <div className="flex flex-col items-center">
        <span className="flex size-8 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600">
          <Icon name="schedule" size={16} />
        </span>
        <span className="mt-1 h-16 border-l-2 border-dashed border-slate-200" />
      </div>

      <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xl font-bold tracking-[-0.01em] text-slate-900">Layover in {airport}</p>
            <p className="text-sm text-slate-500">Connection</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tracking-[-0.01em] text-slate-900">{right}</p>
            <p className="text-sm font-bold text-amber-600">
              {hours}h {mins}m connection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

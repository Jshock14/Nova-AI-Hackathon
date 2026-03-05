import type { FlightOption } from "@/lib/types";
import { Icon } from "@/components/ui/icon";

interface FlightTimelineProps {
  flight: FlightOption;
}

export function FlightTimeline({ flight }: FlightTimelineProps) {
  const depart = new Date(flight.departureTime);
  const arrive = new Date(flight.arrivalTime);
  const layovers = flight.layovers ?? [];

  return (
    <div className="grid grid-cols-[40px_1fr] gap-x-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
          <Icon name="flight_takeoff" />
        </div>
        <div className="w-0.5 bg-slate-200 dark:bg-slate-700 grow my-1 border-l-2 border-dashed" />
      </div>
      <div className="pb-10 pt-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-none">
              {flight.departureAirport}
            </p>
            <p className="text-slate-500 text-sm mt-1">Departure</p>
          </div>
          <p className="text-slate-900 dark:text-slate-100 font-bold">
            {depart.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true })}
          </p>
        </div>
        <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">
          Departure
        </p>
      </div>

      {layovers.map((layover) => (
        <div key={layover.airport} className="contents">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center size-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-100 dark:border-amber-800">
              <Icon name="schedule" size={20} />
            </div>
            <div className="w-0.5 bg-slate-200 dark:bg-slate-700 grow my-1 border-l-2 border-dashed" />
          </div>
          <div className="pb-10 pt-1">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-900 dark:text-slate-100 font-bold">
                    {layover.airport}, {Math.floor(layover.durationMinutes / 60)}h {layover.durationMinutes % 60}m Layover
                  </p>
                  <p className="text-slate-500 text-sm">Connection</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-600 text-xs font-bold">
                    {Math.round(layover.durationMinutes / 60)}h {layover.durationMinutes % 60}m
                    connection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary text-white">
          <Icon name="flight_land" />
        </div>
      </div>
      <div className="pt-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-none">
              {flight.arrivalAirport}
            </p>
            <p className="text-slate-500 text-sm mt-1">Arrival</p>
          </div>
          <p className="text-slate-900 dark:text-slate-100 font-bold">
            {arrive.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true })}
          </p>
        </div>
        <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">Arrival</p>
      </div>
    </div>
  );
}

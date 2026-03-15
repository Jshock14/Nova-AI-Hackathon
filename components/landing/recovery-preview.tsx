import { Icon } from "@/components/ui/icon";

export function RecoveryPreview() {
  return (
    <section className="w-full bg-slate-100 px-6 py-16">
      <div className="mx-auto grid w-full max-w-[1152px] grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)]">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-green-400" />
            </div>
            <span className="rounded bg-slate-200 px-3 py-1 text-[10px] font-bold">LIVE UPDATES</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="inline-flex size-10 items-center justify-center rounded bg-primary/10 text-primary text-sm">UA</span>
                <div>
                  <p className="text-sm font-bold text-slate-900">UA 2402 • Direct</p>
                  <p className="text-xs text-slate-500">Departure: 14:30</p>
                </div>
              </div>
              <span className="text-base font-bold text-green-600">$420</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 opacity-70 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="inline-flex size-10 items-center justify-center rounded bg-primary/10 text-primary text-sm">DL</span>
                <div>
                  <p className="text-sm font-bold text-slate-900">DL 1184 • 1 Stop</p>
                  <p className="text-xs text-slate-500">Departure: 15:15</p>
                </div>
              </div>
              <span className="text-base font-bold text-slate-700">$385</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold tracking-[-0.02em] text-slate-900">Real-time recovery monitoring</h2>
          <p className="mt-4 text-lg leading-7 text-slate-600">
            Our system constantly monitors global flight traffic. As soon as a flight is delayed or
            canceled, we automatically prioritize seats on the next available connections.
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-center gap-3 text-slate-900">
              <Icon name="check_circle" className="text-green-500" /> Direct airline booking access
            </li>
            <li className="flex items-center gap-3 text-slate-900">
              <Icon name="check_circle" className="text-green-500" /> Priority support desk
            </li>
            <li className="flex items-center gap-3 text-slate-900">
              <Icon name="check_circle" className="text-green-500" /> Automated re-ticketing within minutes
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

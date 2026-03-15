import { Icon } from "@/components/ui/icon";

interface ProgressTrackerProps {
  currentStepIndex: number;
}

const steps = [
  "Opening airline sites",
  "Searching flights",
  "Comparing routes",
  "Ranking best options",
];

export function ProgressTracker({ currentStepIndex }: ProgressTrackerProps) {
  const progressPercent = Math.min(100, ((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold leading-tight tracking-[-0.02em] text-slate-900 md:text-[36px]">
            Searching every airline for the best options...
          </p>
        </div>

        <div className="pt-2">
          <div className="mb-2 flex items-end justify-between text-slate-900">
            <p className="text-2xl font-medium md:text-lg">Scanning alternative routes</p>
            <p className="text-sm font-bold text-primary">{Math.round(progressPercent)}%</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-3 text-center text-sm text-slate-500">
            This may take a minute, please don&apos;t close this window.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[384px] space-y-3 pt-2">
        {steps.map((label, index) => {
          const completed = index < currentStepIndex;
          const active = index === currentStepIndex;
          return (
            <div
              key={label}
              className={`flex items-center gap-4 rounded-lg border p-3 ${
                active
                  ? "border-accent/50 bg-accent/5"
                  : completed
                    ? "border-slate-100 bg-slate-50"
                    : "border-transparent opacity-45"
              }`}
            >
              <span className="flex size-6 items-center justify-center rounded-full">
                {completed ? (
                  <span className="flex size-6 items-center justify-center rounded-full bg-green-500 text-white">
                    <Icon name="check" size={14} />
                  </span>
                ) : active ? (
                  <span className="size-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                ) : (
                  <span className="size-6 rounded-full border-2 border-slate-300" />
                )}
              </span>
              <p className={`text-base ${active ? "font-semibold text-slate-900" : "text-slate-600"}`}>
                {label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-100 pt-8 text-center text-sm leading-6 text-slate-500">
        Redirect is checking over <span className="font-semibold text-slate-700">100+ airlines</span> and
        global distribution systems to ensure you reach your destination with minimal delay.
      </div>
    </div>
  );
}

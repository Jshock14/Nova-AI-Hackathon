import { Icon } from "@/components/ui/icon";

interface ProgressTrackerProps {
  currentStepIndex: number;
}

const steps = [
  "Loading available schedules for 100+ airlines",
  "Querying partner APIs",
  "Generating routes",
  "Comparing rates",
];

export function ProgressTracker({ currentStepIndex }: ProgressTrackerProps) {
  const progressPercent = Math.min(100, ((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="flex flex-col gap-4 mb-10">
      <div className="flex gap-6 justify-between items-end">
        <p className="text-slate-900 dark:text-slate-100 text-base font-medium leading-normal">
          Searching for live rates
        </p>
        <p className="text-primary dark:text-accent text-sm font-bold leading-normal">
          {Math.round(progressPercent)}%
        </p>
      </div>
      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-normal text-center">
        This could take a few moments. Hang tight!
      </p>

      <div className="grid gap-4 max-w-sm mx-auto w-full mt-6">
        {steps.map((label, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div
              key={label}
              className={`flex items-center gap-4 p-3 rounded-lg border ${
                isActive
                  ? "border-accent/30 bg-accent/5 ring-1 ring-accent/20"
                  : isCompleted
                    ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700"
                    : "opacity-40"
              }`}
            >
              <div className="flex-shrink-0 size-6 rounded-full flex items-center justify-center">
                {isCompleted && (
                  <div className="size-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <Icon name="check" className="text-sm" />
                  </div>
                )}
                {isActive && (
                  <div
                    className="size-6 rounded-full border-2 border-accent border-t-transparent animate-spin"
                    aria-hidden
                  />
                )}
                {isPending && (
                  <div className="size-6 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600" />
                )}
              </div>
              <p
                className={
                  isActive
                    ? "text-slate-900 dark:text-slate-100 text-base font-semibold"
                    : isCompleted
                      ? "text-slate-700 dark:text-slate-300 text-base font-medium"
                      : "text-slate-500 dark:text-slate-400 text-base font-normal"
                }
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

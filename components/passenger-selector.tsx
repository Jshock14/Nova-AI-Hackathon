import { Button } from "@/components/ui/button";

interface PassengerSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function PassengerSelector({
  value,
  onChange,
  min = 1,
  max = 9,
}: PassengerSelectorProps) {
  const decrement = () => {
    onChange(Math.max(min, value - 1));
  };

  const increment = () => {
    onChange(Math.min(max, value + 1));
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground">
        Passengers
      </label>
      <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={decrement}
          disabled={value <= min}
        >
          -
        </Button>
        <span className="min-w-[2rem] text-center text-sm tabular-nums">
          {value}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={increment}
          disabled={value >= max}
        >
          +
        </Button>
      </div>
    </div>
  );
}


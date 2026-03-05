import { Input } from "@/components/ui/input";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
}

export function DatePicker({ label, value, onChange, min }: DatePickerProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
      />
    </div>
  );
}


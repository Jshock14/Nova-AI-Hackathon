import { Input } from "@/components/ui/input";

interface AirportInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AirportInput({
  label,
  value,
  onChange,
  placeholder,
}: AirportInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "e.g. LAX or Los Angeles (LAX)"}
        autoComplete="off"
      />
    </div>
  );
}


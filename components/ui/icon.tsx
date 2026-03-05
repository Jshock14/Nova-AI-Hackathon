import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={size != null ? { fontSize: size } : undefined}
    >
      {name}
    </span>
  );
}

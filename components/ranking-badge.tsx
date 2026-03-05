import { Badge } from "@/components/ui/badge";
import type { RankingBadgeType } from "@/lib/types";

interface RankingBadgeProps {
  type: RankingBadgeType;
}

const badgeConfig: Record<
  RankingBadgeType,
  { label: string; description: string }
> = {
  "best-price": {
    label: "Best price",
    description: "Lowest total fare among options.",
  },
  "fastest-arrival": {
    label: "Fastest arrival",
    description: "Arrives earliest at your destination.",
  },
  "balanced-choice": {
    label: "Balanced choice",
    description: "Best tradeoff between time and cost.",
  },
  "alternative-hub": {
    label: "Alternative hub",
    description: "Quick layover option.",
  },
};

export function RankingBadge({ type }: RankingBadgeProps) {
  const config = badgeConfig[type];

  return (
    <div className="space-y-0.5">
      <Badge
        variant={type === "best-price" ? "secondary" : "outline"}
        className="text-[10px] uppercase tracking-wide"
      >
        {config.label}
      </Badge>
      <p className="text-[10px] text-muted-foreground">{config.description}</p>
    </div>
  );
}


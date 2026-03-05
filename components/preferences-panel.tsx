"use client";

import { useRedirectState } from "@/app/providers/redirect-provider";
import type { PriorityMode } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

const priorityLabels: Record<PriorityMode, string> = {
  balanced: "Balanced",
  time: "Arrive sooner",
  cost: "Lower cost",
};

export function PreferencesPanel() {
  const { preferences, setPreferences } = useRedirectState();

  const update = <K extends keyof typeof preferences>(
    key: K,
    value: (typeof preferences)[K],
  ) => {
    setPreferences({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold tracking-tight">Preferences</h2>
      <div className="space-y-2">
        <label className="block text-xs font-medium text-muted-foreground">
          Max price (optional)
        </label>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="No limit"
          value={preferences.maxPrice ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            update("maxPrice", v ? Number(v) : undefined);
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-muted-foreground">
          Airline preference (optional)
        </label>
        <Input
          placeholder="e.g. Delta, United"
          value={preferences.airlinePreference ?? ""}
          onChange={(e) => update("airlinePreference", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-muted-foreground">
          Max stops
        </label>
        <Select
          value={
            preferences.maxStops !== undefined
              ? String(preferences.maxStops)
              : "2"
          }
          onValueChange={(value) =>
            update(
              "maxStops",
              Number(value) as 0 | 1 | 2,
            )
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Nonstop only</SelectItem>
            <SelectItem value="1">Up to 1 stop</SelectItem>
            <SelectItem value="2">Up to 2+ stops</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-muted-foreground">
          What should we prioritize?
        </label>
        <div className="flex gap-1">
          {(["balanced", "time", "cost"] as PriorityMode[]).map((mode) => (
            <Toggle
              key={mode}
              size="sm"
              pressed={preferences.priorityMode === mode}
              onPressedChange={() => update("priorityMode", mode)}
              className="flex-1 text-xs"
            >
              {priorityLabels[mode]}
            </Toggle>
          ))}
        </div>
      </div>
    </div>
  );
}


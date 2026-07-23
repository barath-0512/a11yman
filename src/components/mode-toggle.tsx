"use client";

import { Code2, ClipboardCheck } from "lucide-react";
import { useMode } from "@/components/mode-provider";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { mode, setMode } = useMode();

  return (
    <div
      role="radiogroup"
      aria-label="Site mode"
      className="inline-flex items-center rounded-full border border-border bg-secondary/60 p-1"
    >
      {(
        [
          { value: "developer", label: "Developer", icon: Code2 },
          { value: "tester", label: "Tester", icon: ClipboardCheck },
        ] as const
      ).map(({ value, label, icon: Icon }) => {
        const selected = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${label} mode`}
            onClick={() => setMode(value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              selected
                ? "bg-accent text-accent-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

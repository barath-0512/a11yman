"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { id: "standard", label: "Standard", meta: "5–7 business days · Free" },
  { id: "express", label: "Express", meta: "2–3 business days · $12" },
  { id: "overnight", label: "Overnight", meta: "Next business day · $28" },
];

/**
 * ⚠ Deliberately broken radio group — for learning only.
 *
 * Defects, on purpose:
 * 1. Every option is a separately-focusable <div> with tabIndex={0} —
 *    ALL three are individual Tab stops instead of only the selected one
 *    being reachable, breaking the roving-tabindex model users expect
 *    from radio groups and bloating the tab sequence. Fails SC 2.4.3 in
 *    spirit and creates a confusing, non-standard interaction.
 * 2. No role="radiogroup" / role="radio" / aria-checked — a screen reader
 *    announces plain, unrelated text blocks with no indication these are
 *    mutually-exclusive options or which one is selected. Fails SC 4.1.2.
 * 3. No arrow key support at all — every option must be Tab'd to
 *    individually and clicked with a mouse; there is no way to move
 *    between and select options with arrow keys the way native radios
 *    (or a correct custom implementation) support. Fails SC 2.1.1.
 */
export function RadioGroupPatternBroken() {
  const [selected, setSelected] = React.useState("standard");

  return (
    <div className="w-full max-w-sm space-y-2">
      {OPTIONS.map((option) => {
        const checked = selected === option.id;
        return (
          <div
            key={option.id}
            tabIndex={0}
            onClick={() => setSelected(option.id)}
            className={cn(
              "flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border p-3.5 text-left",
              checked
                ? "border-accent bg-accent/10"
                : "border-border bg-card hover:bg-secondary/40"
            )}
          >
            <span>
              <span className="block text-sm font-medium">{option.label}</span>
              <span className="block text-xs text-muted-foreground">{option.meta}</span>
            </span>
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                checked ? "border-accent" : "border-border"
              )}
            >
              {checked && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
            </span>
          </div>
        );
      })}
    </div>
  );
}

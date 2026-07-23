"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = ["Relevance", "Newest first", "Oldest first", "Price: low to high", "Price: high to low"];
const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Rust", "Go", "Swift", "Kotlin"];

/**
 * ⚠ Deliberately broken listbox — for learning only.
 *
 * Defects, on purpose:
 * 1. Options are plain <div onClick> elements with no role="option" and no
 *    aria-selected — a screen reader announces them as unstructured text,
 *    not as selectable options in a listbox (fails 4.1.2).
 * 2. No roving tabindex and no arrow-key handling — the list is entirely
 *    mouse-only. Keyboard users cannot move through or select options at
 *    all (fails 2.1.1).
 * 3. The container has no role="listbox" / accessible name, so AT has no
 *    way to announce this as a selectable list in the first place.
 * 4. In the multi-select variant, selection is only shown visually via a
 *    checkmark/highlight — there is no aria-selected or
 *    aria-multiselectable, so assistive tech users can't tell which items
 *    (or how many) are selected (fails 4.1.2 and 1.3.1).
 */
export function ListboxPatternBroken() {
  const [selected, setSelected] = React.useState(0);

  return (
    <div className="w-72">
      <span className="mb-1.5 block text-sm font-medium">Sort by</span>
      <div className="max-h-56 overflow-auto rounded-lg border border-border bg-card p-1 text-sm">
        {SORT_OPTIONS.map((option, i) => (
          <div
            key={option}
            onClick={() => setSelected(i)}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-md px-3 py-2",
              i === selected ? "bg-accent text-accent-foreground" : "hover:bg-secondary"
            )}
          >
            {option}
            {i === selected && <Check className="h-4 w-4" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MultiListboxPatternBroken() {
  const [selected, setSelected] = React.useState<Set<number>>(new Set([0, 2]));

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="w-72">
      <span className="mb-1.5 block text-sm font-medium">Languages (multi-select)</span>
      <div className="max-h-64 overflow-auto rounded-lg border border-border bg-card p-1 text-sm">
        {LANGUAGES.map((lang, i) => {
          const isSelected = selected.has(i);
          return (
            <div
              key={lang}
              onClick={() => toggle(i)}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-md px-3 py-2",
                isSelected ? "bg-accent/15 text-accent-text" : "hover:bg-secondary"
              )}
            >
              {lang}
              {isSelected && <Check className="h-4 w-4" aria-hidden="true" />}
            </div>
          );
        })}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{selected.size} of {LANGUAGES.length} selected</p>
    </div>
  );
}

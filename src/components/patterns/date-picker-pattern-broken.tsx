"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

/**
 * ⚠ Deliberately broken date picker — for learning only.
 *
 * Defects, on purpose (same category as the broken Dialog pattern):
 * 1. Calendar grid built from <div onClick> date cells with no
 *    role="grid"/"row"/"gridcell" structure at all — a screen reader has
 *    no idea this is a calendar or that dates relate to each other by
 *    row/column. Fails SC 1.3.1 and 4.1.2.
 * 2. No keyboard support whatsoever — dates can only be selected with a
 *    mouse click; there is no way to Tab to a specific date or use arrow
 *    keys to move between them. Fails SC 2.1.1.
 * 3. The popup has no focus trap — Tab walks straight through to page
 *    content behind it, exactly like the broken Dialog pattern.
 * 4. No Escape handling — there is no keyboard way to dismiss the popup.
 */
export function DatePickerPatternBroken() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<number | null>(null);

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Date"
          readOnly
          value={selected ? `2026-07-${String(selected).padStart(2, "0")}` : ""}
          className="h-10 w-40 rounded-lg border border-border bg-background px-3 text-sm"
        />
        {/* A div instead of a button — not keyboard focusable or operable. */}
        <div
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-card"
        >
          <CalendarIcon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      {open && (
        // No role="dialog", no focus trap, no Escape handling.
        <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-border bg-card p-4 shadow-soft-lg">
          <p className="mb-2 text-sm font-semibold">July 2026</p>
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((d) => (
              // Plain divs with onClick — mouse-only, no grid semantics.
              <div
                key={d}
                onClick={() => {
                  setSelected(d);
                  setOpen(false);
                }}
                className={
                  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm hover:bg-secondary " +
                  (selected === d ? "bg-accent text-accent-foreground" : "")
                }
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

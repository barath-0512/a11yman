"use client";

import * as React from "react";

const ITEMS = ["New file", "Duplicate", "Rename"];

/**
 * ⚠ Deliberately broken menu button — for learning only.
 *
 * Defects, on purpose:
 * 1. No aria-haspopup/aria-expanded on the trigger.
 * 2. No role="menu"/"menuitem" — reads as a plain list of links.
 * 3. No arrow-key navigation between items; only Tab (through every item)
 *    and mouse click work.
 * 4. Escape does not close the menu and does not restore focus.
 */
export function MenuButtonPatternBroken() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-medium"
      >
        Actions
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-card py-1 shadow-soft-lg">
          {ITEMS.map((item) => (
            <div
              key={item}
              onClick={() => setOpen(false)}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-secondary"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

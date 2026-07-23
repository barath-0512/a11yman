"use client";

import * as React from "react";

/**
 * ⚠ Deliberately broken dialog — for learning only.
 *
 * Defects, on purpose:
 * 1. No role="dialog" / aria-modal — a screen reader has no idea this is a
 *    dialog; it just reads as more page content (fails 4.1.2).
 * 2. No focus trap — Tab walks straight through to the page behind the
 *    overlay (fails 2.1.2 / 2.4.3 in spirit, and traps sighted mouse users
 *    visually while keyboard users "escape" the visual boundary).
 * 3. No Escape handling — keyboard-only users have no way to back out
 *    (fails 2.1.1 Keyboard).
 * 4. Focus is never moved into the dialog on open, and never restored to the
 *    trigger on close (fails the APG focus-management requirement).
 */
export function DialogPatternBroken({
  triggerLabel,
  title,
}: {
  triggerLabel: string;
  title: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          {/* No role, no aria-modal, no aria-labelledby, no focus trap. */}
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft-lg">
            <h2 className="mb-4 text-lg font-semibold">{title}</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              This overlay looks like a dialog but is invisible to assistive
              tech and cannot be closed with Escape.
            </p>
            <div className="flex justify-end gap-2">
              {/* A div styled as a button — not natively focusable or
                  keyboard-operable (fails 2.1.1 and 4.1.2). */}
              <div
                onClick={() => setOpen(false)}
                className="h-9 cursor-pointer rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground flex items-center"
              >
                Close
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

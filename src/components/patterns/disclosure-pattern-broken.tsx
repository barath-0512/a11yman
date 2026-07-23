"use client";

import * as React from "react";

/**
 * ⚠ Deliberately broken disclosure — for learning only.
 *
 * Defects, on purpose:
 * 1. Trigger is a <div> with an onClick handler — not focusable and has
 *    no default keyboard activation, so keyboard users cannot reach or
 *    operate it at all (fails 2.1.1 and 4.1.2).
 * 2. aria-expanded is set once on mount and never updates — the panel
 *    visibly opens and closes, but assistive tech is told a fixed,
 *    incorrect state forever, which is arguably worse than omitting the
 *    attribute entirely (fails 4.1.2).
 * 3. The panel is hidden with a CSS class (max-height: 0; overflow:
 *    hidden) instead of the hidden attribute, so its content remains in
 *    the tab order even while visually collapsed — a keyboard user can
 *    tab into invisible controls with no visible focus indicator.
 */
export function DisclosurePatternBroken() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-4">
      <div
        onClick={() => setExpanded((e) => !e)}
        aria-expanded="false"
        className="cursor-pointer text-sm font-medium"
      >
        Advanced options
      </div>
      <div
        className={
          "space-y-3 text-sm transition-all " +
          (expanded ? "mt-3 max-h-40 overflow-hidden" : "max-h-0 overflow-hidden")
        }
      >
        <label className="block">
          <span className="mb-1 block text-muted-foreground">Request timeout (seconds)</span>
          <input
            type="number"
            defaultValue={30}
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5"
          />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4" />
          <span>Enable verbose logging</span>
        </label>
      </div>
    </div>
  );
}

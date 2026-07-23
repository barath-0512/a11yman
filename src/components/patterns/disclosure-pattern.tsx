"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Hand-coded APG "Disclosure (Show/Hide)" pattern: a single button that
 * toggles a single section of content. Unlike Accordion, there is no
 * grouping — no arrow-key roving focus between multiple disclosures, and
 * the trigger doesn't need to be wrapped in a heading element.
 */
export function DisclosurePattern() {
  const [expanded, setExpanded] = React.useState(false);
  const panelId = "disclosure-pattern-panel";

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-4">
      <button
        type="button"
        // aria-expanded tells AT whether the panel is currently visible —
        // announced as "expanded" or "collapsed."
        aria-expanded={expanded}
        // aria-controls associates this button with the panel it toggles
        // by id, so AT can relate the two even though the panel isn't
        // nested inside the button.
        aria-controls={panelId}
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between gap-3 text-left text-sm font-medium"
      >
        Advanced options
        <ChevronDown
          aria-hidden="true"
          className={
            "h-4 w-4 shrink-0 transition-transform " +
            (expanded ? "rotate-180" : "")
          }
        />
      </button>
      {/* The hidden attribute removes the panel from the accessibility
          tree and the tab order entirely when collapsed — stronger than
          CSS display tricks that can leave content focusable. */}
      <div id={panelId} hidden={!expanded} className="mt-3 space-y-3 text-sm">
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

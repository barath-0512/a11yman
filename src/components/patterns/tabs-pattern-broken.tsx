"use client";

import * as React from "react";

const TABS = [
  { id: "profile", label: "Profile", content: "Manage your name, photo, and public bio." },
  { id: "security", label: "Security", content: "Change your password and manage two-factor authentication." },
];

/**
 * ⚠ Deliberately broken tabs — for learning only.
 *
 * Defects, on purpose:
 * 1. No role="tablist"/"tab"/"tabpanel" — a screen reader has no idea this
 *    is a tabbed interface; each "tab" reads as an unrelated clickable div.
 * 2. Every tab is in the natural Tab order (no roving tabindex) and there
 *    is no arrow-key support at all.
 * 3. No aria-selected, so state changes are silent to AT.
 */
export function TabsPatternBroken() {
  const [selected, setSelected] = React.useState(TABS[0].id);

  return (
    <div>
      <div className="inline-flex gap-1 rounded-full border border-border bg-secondary/60 p-1">
        {TABS.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setSelected(tab.id)}
            className={
              "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium " +
              (tab.id === selected
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground")
            }
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        {TABS.find((t) => t.id === selected)?.content}
      </div>
    </div>
  );
}

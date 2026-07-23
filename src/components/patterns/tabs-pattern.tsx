"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "profile", label: "Profile", content: "Manage your name, photo, and public bio." },
  { id: "security", label: "Security", content: "Change your password and manage two-factor authentication." },
  { id: "billing", label: "Billing", content: "View invoices and update your payment method." },
];

/**
 * Hand-coded APG "Tabs" pattern with a roving tabindex: only the active tab
 * is in the Tab order (tabIndex=0); the rest are tabIndex=-1 and reachable
 * only via arrow keys. This is what makes Tab skip straight from the tab
 * list to the panel instead of stopping on every tab.
 *
 * activationMode="automatic" selects (and shows) a tab as soon as it
 * receives focus via arrow keys. activationMode="manual" requires an
 * explicit Enter/Space to activate a focused-but-not-yet-selected tab —
 * use manual when activating a tab is expensive (e.g. triggers a network
 * request) so arrowing through options doesn't fire it on every keystroke.
 */
export function TabsPattern({
  activationMode = "automatic",
}: {
  activationMode?: "automatic" | "manual";
}) {
  const [selected, setSelected] = React.useState(TABS[0].id);
  const [focused, setFocused] = React.useState(TABS[0].id);
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  function moveFocus(index: number) {
    const tab = TABS[index];
    setFocused(tab.id);
    tabRefs.current[tab.id]?.focus();
    if (activationMode === "automatic") setSelected(tab.id);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const currentIndex = TABS.findIndex((t) => t.id === focused);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveFocus((currentIndex + 1) % TABS.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveFocus((currentIndex - 1 + TABS.length) % TABS.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      moveFocus(0);
    } else if (e.key === "End") {
      e.preventDefault();
      moveFocus(TABS.length - 1);
    } else if (
      activationMode === "manual" &&
      (e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      setSelected(focused);
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Account settings"
        onKeyDown={onKeyDown}
        className="inline-flex gap-1 rounded-full border border-border bg-secondary/60 p-1"
      >
        {TABS.map((tab) => {
          const isSelected = tab.id === selected;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              role="tab"
              id={`tabs-pattern-tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`tabs-pattern-panel-${tab.id}`}
              tabIndex={tab.id === focused ? 0 : -1}
              onClick={() => {
                setFocused(tab.id);
                setSelected(tab.id);
              }}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                isSelected
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabs-pattern-panel-${tab.id}`}
          aria-labelledby={`tabs-pattern-tab-${tab.id}`}
          hidden={tab.id !== selected}
          tabIndex={0}
          className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

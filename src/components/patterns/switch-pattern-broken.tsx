"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ⚠ Deliberately broken switch — for learning only.
 *
 * Defects, on purpose:
 * 1. Built from a <div> with only an onClick handler — no default
 *    focusability or keyboard activation, so keyboard-only users cannot
 *    operate it at all. Fails SC 2.1.1.
 * 2. No role="switch" (or any role) and no aria-checked — a screen reader
 *    announces nothing but the visible label text, with no indication
 *    this is an interactive on/off control or what its current state is.
 *    Fails SC 4.1.2.
 * 3. Mouse/touch only: the sliding animation is purely a CSS transition
 *    triggered by a click handler, with no keydown handling whatsoever —
 *    there is no code path that could even be extended to support the
 *    keyboard without a rewrite.
 * 4. No visible focus indicator, because the element is never focusable
 *    in the first place — impossible to know via keyboard alone where
 *    you are relative to this control.
 */
export function SwitchPatternBroken() {
  const [on, setOn] = React.useState(true);

  return (
    <div className="flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl border border-border p-4">
      <span className="text-sm font-medium">Wi-Fi</span>
      <div
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors",
          on ? "bg-accent" : "bg-secondary"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-card shadow transition-transform",
            on ? "translate-x-6" : "translate-x-1"
          )}
        />
      </div>
    </div>
  );
}

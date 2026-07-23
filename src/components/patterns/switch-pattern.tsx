"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Hand-coded APG "Switch" pattern: role="switch" on a <button>, with
 * aria-checked reflecting on/off state. role="switch" is deliberately
 * distinct from role="checkbox" — screen readers announce "switch,
 * on/off" instead of "checkbox, checked/unchecked," which better matches
 * the instant-effect mental model a toggle switch implies (the setting
 * takes effect immediately, unlike a checkbox in a form that's often
 * applied only on submit).
 */
export function SwitchPattern() {
  const [on, setOn] = React.useState(true);

  function toggle() {
    setOn((v) => !v);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    // Space toggles, matching native checkbox/button conventions. Enter is
    // also commonly supported for switches since <button> natively fires
    // onClick for both — no extra handling required for Enter here.
    if (e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }

  return (
    <div className="flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl border border-border p-4">
      <span id="wifi-switch-label" className="text-sm font-medium">
        Wi-Fi
      </span>
      <button
        type="button"
        role="switch"
        // aria-checked (not aria-pressed) is what makes this a switch
        // rather than a toggle button — it's a boolean-only state, there is
        // no "mixed" for switches (unlike tri-state checkboxes).
        aria-checked={on}
        aria-labelledby="wifi-switch-label"
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
          on ? "bg-accent" : "bg-secondary"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-card shadow transition-transform",
            on ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

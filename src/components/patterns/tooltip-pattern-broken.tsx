"use client";

import * as React from "react";

/**
 * ⚠ Deliberately broken tooltip — for learning only.
 *
 * Defects, on purpose:
 * 1. Only onMouseEnter/onMouseLeave are wired up — there is no onFocus
 *    handler at all. Keyboard users (and anyone using switch access or a
 *    screen reader without a mouse) can tab directly to the trigger and
 *    will never see the tooltip appear, because focus alone never
 *    triggers it. Fails SC 2.1.1 (Keyboard) and defeats the purpose of a
 *    tooltip meant to supplement a control for everyone, not just mouse
 *    users.
 * 2. No aria-describedby anywhere — even if a screen reader user somehow
 *    triggers the tooltip to display, the trigger never announces it. The
 *    popup text is only ever visually associated with the button, not
 *    programmatically. Fails SC 1.4.13 and 4.1.2.
 * 3. No Escape handling — once shown (via mouse), there is no dismiss
 *    mechanism other than moving the pointer away, which fails the
 *    "dismissible" requirement of SC 1.4.13.
 */
export function TooltipPatternBroken({
  label,
  tooltip,
}: {
  label: string;
  tooltip: string;
}) {
  const [visible, setVisible] = React.useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        // BUG: no onFocus/onBlur — keyboard-only users never trigger this.
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        // BUG: no aria-describedby linking to the tooltip text below.
        className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium"
      >
        {label}
      </button>
      {visible && (
        // BUG: no role="tooltip", no id to be referenced by aria-describedby.
        <span className="absolute left-1/2 top-full z-50 mt-2 w-max max-w-xs -translate-x-1/2 rounded-lg bg-foreground px-2.5 py-1.5 text-xs text-background shadow-soft-lg">
          {tooltip}
        </span>
      )}
    </span>
  );
}

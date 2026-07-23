"use client";

import * as React from "react";

const HIDE_DELAY_MS = 150;

/**
 * Hand-coded APG "Tooltip" pattern.
 *
 * role="tooltip" on the popup + aria-describedby on the trigger is the
 * whole contract: the trigger's accessible NAME stays whatever it already
 * is (e.g. its visible label), and the tooltip text is appended as
 * supplementary DESCRIPTION. A tooltip must contain only non-interactive
 * text — no links or buttons inside it. If you need interactive content in
 * a hover popup, that's the separate "Popover" pattern, not a tooltip.
 *
 * Shows on BOTH hover and focus — focus is the critical one. A sighted
 * mouse user can just hover; a keyboard or switch-access user can only
 * ever reach this content by tabbing to the trigger, so onFocus is not
 * optional the way it might seem for a "just a hover thing."
 *
 * SC 1.4.13 Content on Hover or Focus requires the tooltip be:
 *  - Dismissible: Escape hides it (without moving focus away).
 *  - Hoverable: a pointer can move from the trigger onto the tooltip
 *    itself without it disappearing (relevant mainly when the tooltip has
 *    a nontrivial size/position); we implement this with a short close
 *    delay so the pointer has time to cross the gap.
 *  - Persistent: stays visible until the trigger loses hover/focus or
 *    Escape is pressed — not hidden by an arbitrary timer while the user
 *    is still reading it.
 */
export function TooltipPattern({
  label,
  tooltip,
}: {
  label: string;
  tooltip: string;
}) {
  const [visible, setVisible] = React.useState(false);
  const hideTimeoutRef = React.useRef<number | null>(null);
  const triggerId = React.useId();
  const tooltipId = React.useId();

  function show() {
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    setVisible(true);
  }

  // Delayed hide gives the pointer a moment to travel from the trigger onto
  // the tooltip itself (the "hoverable" requirement of SC 1.4.13) instead of
  // vanishing the instant the cursor leaves the trigger's bounding box.
  function scheduleHide() {
    hideTimeoutRef.current = window.setTimeout(() => {
      setVisible(false);
    }, HIDE_DELAY_MS);
  }

  function hideImmediately() {
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    setVisible(false);
  }

  React.useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <span className="relative inline-block">
      <button
        id={triggerId}
        type="button"
        // aria-describedby is what actually connects the trigger to the
        // tooltip for AT — without it, a focused button never tells a
        // screen reader user the supplementary text exists at all, even
        // though it may be visually shown.
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
        onFocus={show}
        onBlur={hideImmediately}
        onKeyDown={(e) => {
          // Dismissible: Escape hides the tooltip while focus stays put.
          if (e.key === "Escape" && visible) {
            e.preventDefault();
            hideImmediately();
          }
        }}
        className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium"
      >
        {label}
      </button>
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          // Hoverable: keep the tooltip visible while the pointer is over
          // it too, and cancel any pending hide from leaving the trigger.
          onMouseEnter={show}
          onMouseLeave={scheduleHide}
          className="absolute left-1/2 top-full z-50 mt-2 w-max max-w-xs -translate-x-1/2 rounded-lg bg-foreground px-2.5 py-1.5 text-xs text-background shadow-soft-lg"
        >
          {tooltip}
        </span>
      )}
    </span>
  );
}

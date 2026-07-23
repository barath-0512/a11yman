"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";

const AUTO_DISMISS_MS = 4000;

/**
 * Hand-coded "Toast / Status message" pattern.
 *
 * Key subtlety: the aria-live region container is rendered UNCONDITIONALLY,
 * even when there's no message. Many screen readers only pick up a live
 * region's contents if the region itself already exists in the accessibility
 * tree BEFORE content is injected into it — if you mount the
 * role="status"/aria-live element and its text in the same paint (e.g. by
 * conditionally rendering the whole <div> only when a toast is visible),
 * some AT misses the announcement entirely because it never had a chance to
 * "discover" the live region first. So: the container always exists; only
 * its text content is swapped via state.
 *
 * role="status" carries an implicit aria-live="polite" — appropriate for
 * routine confirmations that shouldn't interrupt whatever the user is doing.
 * Use role="alert" (implicit aria-live="assertive") only for urgent/error
 * toasts that truly warrant interrupting.
 */
export function ToastPattern() {
  const [message, setMessage] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<number | null>(null);

  function showToast() {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setMessage("Changes saved successfully.");
    timeoutRef.current = window.setTimeout(() => {
      setMessage(null);
    }, AUTO_DISMISS_MS);
  }

  function dismiss() {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setMessage(null);
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={showToast}
        className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
      >
        Show success toast
      </button>

      {/*
        This container exists at all times — never conditionally mounted —
        so screen readers have already registered it as a live region
        before any text lands inside it. Only the message content (and the
        visible card below it) toggles.
      */}
      <div role="status" aria-live="polite" className="sr-only">
        {message}
      </div>

      {message && (
        <div
          className="mt-4 flex max-w-sm items-start gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft-lg"
          // Toasts are non-modal: no focus trap, no stolen focus. A sighted
          // keyboard user can keep typing right through this appearing.
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
          <p className="flex-1 text-sm">{message}</p>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss notification"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

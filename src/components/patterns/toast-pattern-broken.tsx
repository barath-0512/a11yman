"use client";

import * as React from "react";

/**
 * ⚠ Deliberately broken toast — for learning only.
 *
 * Defects, on purpose:
 * 1. No aria-live (and no role="status"/"alert") anywhere on the message
 *    container — screen readers treat it as silent page content. Sighted
 *    users see it appear; everyone using a screen reader never learns the
 *    save happened at all. Fails SC 4.1.3 Status Messages.
 * 2. The live-region container itself is only mounted while a message
 *    exists (conditionally rendered together with its text, in the same
 *    paint) instead of existing persistently — even if you slapped
 *    aria-live on it, many AT/browser combinations wouldn't reliably
 *    announce content that appears in the same tick the region is created.
 * 3. Auto-dismisses after 900ms — far too fast for anyone (screen reader
 *    or sighted) to read the message, let alone for AT to finish speaking
 *    it before the DOM node is gone.
 */
export function ToastPatternBroken() {
  const [message, setMessage] = React.useState<string | null>(null);

  function showToast() {
    setMessage("Changes saved successfully.");
    // BUG: absurdly short auto-dismiss — the message vanishes before most
    // users (sighted or AT) can perceive it.
    window.setTimeout(() => setMessage(null), 900);
  }

  return (
    <div>
      <button
        type="button"
        onClick={showToast}
        className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
      >
        Show success toast
      </button>

      {/* BUG: no role, no aria-live, and mounted+filled in the same paint. */}
      {message && (
        <div className="mt-4 max-w-sm rounded-2xl border border-border bg-card p-4 shadow-soft-lg">
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
}

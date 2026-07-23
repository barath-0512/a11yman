"use client";

import * as React from "react";

/**
 * Correct native usage: a real <a href> for navigation and a real
 * <button type="button"> for an in-page action. This is intentionally
 * identical to the primary "custom" demo on this page — for Link vs.
 * Button, the "right way" IS just the native elements. See the "Custom
 * ARIA" tab for what it costs to faithfully reimplement this without them.
 */
export function NativeLinkVsButtonPattern() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href="/pricing"
        onClick={(e) => e.preventDefault()}
        className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
      >
        View pricing
      </a>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
      >
        Add to cart{count > 0 ? ` (${count})` : ""}
      </button>
    </div>
  );
}

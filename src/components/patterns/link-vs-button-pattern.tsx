"use client";

import * as React from "react";

/**
 * "Faithful" custom reimplementation of a link and a button using
 * role="link" / role="button" on non-interactive elements, with every
 * piece of manual plumbing wired up by hand: tabIndex to make them
 * focusable, the correct ARIA role so AT announces the right element type,
 * and keydown handlers that replicate native activation keys — Enter only
 * for the link, Enter AND Space for the button, since that's what real
 * <a> and <button> elements do. This works, but it's a lot of code to
 * reproduce what <a href> and <button> give you for free. See the "Native
 * HTML" tab for the version anyone should actually ship.
 */
export function LinkVsButtonCustomPattern() {
  const [count, setCount] = React.useState(0);

  function onLinkKeyDown(e: React.KeyboardEvent) {
    // Native <a> only activates on Enter, not Space.
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  function onButtonKeyDown(e: React.KeyboardEvent) {
    // Native <button> activates on both Enter and Space.
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCount((c) => c + 1);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span
        role="link"
        tabIndex={0}
        onClick={(e) => e.preventDefault()}
        onKeyDown={onLinkKeyDown}
        className="inline-flex cursor-pointer items-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
      >
        View pricing
      </span>
      <span
        role="button"
        tabIndex={0}
        onClick={() => setCount((c) => c + 1)}
        onKeyDown={onButtonKeyDown}
        className="inline-flex cursor-pointer items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
      >
        Add to cart{count > 0 ? ` (${count})` : ""}
      </span>
    </div>
  );
}

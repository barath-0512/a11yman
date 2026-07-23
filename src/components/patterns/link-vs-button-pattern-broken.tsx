"use client";

import * as React from "react";

/**
 * ⚠ Deliberately broken link/button — for learning only. This is the
 * single most common real-world defect pattern on this site.
 *
 * Defects, on purpose:
 * 1. A <div onClick> styled like a button performs an action ("Add to
 *    cart"). It has no role, is not in the Tab order, and does not
 *    respond to Enter or Space — completely unusable by keyboard.
 * 2. A <span onClick> styled like a link performs a fake "navigation" via
 *    a JS side effect. Same problem: not focusable, no keyboard support,
 *    and a screen reader announces it as plain text, not a link.
 * 3. An <a href="#"> with onClick + preventDefault() is used purely as a
 *    button-substitute ("wrong direction" mistake) — this pollutes browser
 *    history, breaks "open in new tab" / "copy link", and is announced as
 *    a link that promises navigation it never performs.
 */
export function LinkVsButtonPatternBroken() {
  const [count, setCount] = React.useState(0);
  const [navigated, setNavigated] = React.useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Div pretending to be a button */}
      <div
        onClick={() => setCount((c) => c + 1)}
        className="inline-flex cursor-pointer items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
      >
        Add to cart{count > 0 ? ` (${count})` : ""}
      </div>

      {/* Span pretending to be a link */}
      <span
        onClick={() => setNavigated(true)}
        className="inline-flex cursor-pointer items-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
      >
        {navigated ? "Navigated (fake)" : "View pricing"}
      </span>

      {/* Anchor used purely as a button — "wrong direction" */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCount((c) => c + 1);
        }}
        className="inline-flex items-center rounded-full border border-dashed border-border px-4 py-2 text-sm font-medium text-accent underline decoration-dotted underline-offset-2"
      >
        Remove item
      </a>
    </div>
  );
}

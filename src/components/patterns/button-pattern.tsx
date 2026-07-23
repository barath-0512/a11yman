"use client";

import * as React from "react";
import { Star } from "lucide-react";

/**
 * Hand-coded APG "Button" pattern, in two flavors:
 *
 * 1. A plain action button — a real <button>. Native semantics give us
 *    the button role, focusability, and Enter+Space activation for free.
 *    There is genuinely nothing to add here; that's the point.
 *
 * 2. A toggle button — still a real <button>, but we set aria-pressed
 *    ourselves to expose an on/off state. aria-pressed is NOT something
 *    <button> gives you automatically; unlike aria-expanded on a
 *    disclosure, there's no built-in HTML control for "pressed," so a
 *    toggle button always needs this one attribute wired up by hand.
 */
export function ButtonPattern() {
  const [pressed, setPressed] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Plain action button: no ARIA needed at all. */}
      <button
        type="button"
        onClick={() => setSaved(true)}
        className="inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
      >
        {saved ? "Saved" : "Save changes"}
      </button>

      {/* Toggle button: aria-pressed communicates on/off state to AT.
          The visual style also changes, but sighted users get the same
          "on" signal from color as screen reader users get from the
          announced "pressed" state. */}
      <button
        type="button"
        aria-pressed={pressed}
        onClick={() => setPressed((p) => !p)}
        className={
          "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium " +
          (pressed
            ? "border-accent bg-accent/15 text-accent-text"
            : "border-border bg-card text-foreground")
        }
      >
        <Star
          aria-hidden="true"
          className={"h-4 w-4 " + (pressed ? "fill-current" : "")}
        />
        {pressed ? "Favorited" : "Favorite"}
      </button>
    </div>
  );
}

/**
 * The APG also documents a role="button" pattern for cases where you truly
 * cannot use a native <button> element (e.g. a non-form-associated custom
 * element in a design system with hard constraints). It requires
 * reimplementing everything the browser gives you for free:
 *   - tabIndex={0} so it's reachable by Tab
 *   - role="button" so AT announces it correctly
 *   - onKeyDown handling BOTH Enter and Space, since a <div> has no default
 *     key behavior at all
 *   - e.preventDefault() on Space specifically, or the page scrolls down
 *     (Space's default action outside a real button/input is "scroll")
 *
 * This is shown purely to illustrate the cost of not using <button>: more
 * code, and more chances to get something subtly wrong (missing Space
 * handling, forgetting preventDefault, forgetting focus styles).
 */
export function CustomAriaButtonPattern() {
  const [count, setCount] = React.useState(0);

  function activate() {
    setCount((c) => c + 1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      // Enter's default action on a div is a no-op, so no preventDefault
      // is strictly required, but it's harmless to include for symmetry.
      activate();
    } else if (e.key === " ") {
      // Space must be prevented — its default action is "scroll the
      // page," which would fire on every activation if left unhandled.
      e.preventDefault();
      activate();
    }
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={activate}
        onKeyDown={onKeyDown}
        className="inline-flex h-10 w-fit cursor-pointer items-center rounded-full border border-border bg-card px-4 text-sm font-medium"
      >
        Clicked {count} {count === 1 ? "time" : "times"}
      </div>
      <p className="text-xs text-muted-foreground">
        Reimplemented from a &lt;div&gt; — same behavior as a real button,
        with roughly 10x the code and several ways to get it wrong.
      </p>
    </div>
  );
}

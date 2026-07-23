"use client";

import * as React from "react";
import { Star } from "lucide-react";

/**
 * ⚠ Deliberately broken toggle button — for learning only.
 *
 * Defects, on purpose:
 * 1. Built from a <div onClick> — not a real <button> and has no
 *    role="button" either, so it is completely invisible to the
 *    accessibility tree as an interactive control (fails 4.1.2).
 * 2. No tabIndex — the element cannot receive keyboard focus at all,
 *    so keyboard-only users cannot even reach it, let alone activate it
 *    (fails 2.1.1).
 * 3. No keydown handling of any kind — even if it could be focused,
 *    nothing would happen on Enter or Space.
 * 4. No aria-pressed — the on/off state exists only as a CSS class change;
 *    a screen reader user has no way to know this control has a state at
 *    all, let alone what it currently is (fails 4.1.2).
 *
 * Visually this looks identical to the working toggle button — that's
 * the point. The defect is only detectable by trying to use it without a
 * mouse, or by inspecting the accessibility tree.
 */
export function ButtonPatternBroken() {
  const [pressed, setPressed] = React.useState(false);

  return (
    <div
      onClick={() => setPressed((p) => !p)}
      className={
        "inline-flex h-10 w-fit cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-medium " +
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
    </div>
  );
}

"use client";

import * as React from "react";

const LINKS = [
  { id: "home", label: "Home", href: "/demo/home" },
  { id: "docs", label: "Docs", href: "/demo/docs" },
  { id: "pricing", label: "Pricing", href: "/demo/pricing" },
];

/**
 * ⚠ Deliberately broken navigation — for learning only.
 *
 * Defects, on purpose:
 * 1. Multiple <nav> elements with no aria-label distinguishing them. A
 *    screen reader user pulling up a landmark list hears "navigation,
 *    navigation, navigation" with no way to tell which is which.
 * 2. No aria-current="page" on the active link — there is no programmatic
 *    way to determine which page you're currently on from this menu.
 * 3. The active link is only distinguished by color (bg-accent), which
 *    also fails to convey state to non-visual users.
 */
export function NavigationPatternBroken() {
  const [current, setCurrent] = React.useState("home");

  return (
    <div className="space-y-3">
      <nav className="rounded-2xl border border-border bg-card p-4">
        <ul className="flex flex-wrap gap-1">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(link.id);
                }}
                className={
                  "inline-block rounded-full px-3.5 py-1.5 text-sm font-medium " +
                  (link.id === current
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground")
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {/* A second, unrelated unlabeled <nav> elsewhere on a real page would
          collide with the one above in the landmark list — shown here only
          as a code comment since duplicating it visually adds no value:
          <nav><ul>...footer links...</ul></nav> */}
    </div>
  );
}

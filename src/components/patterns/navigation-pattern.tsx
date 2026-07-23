"use client";

import * as React from "react";

const LINKS = [
  { id: "home", label: "Home", href: "/demo/home" },
  { id: "docs", label: "Docs", href: "/demo/docs" },
  { id: "pricing", label: "Pricing", href: "/demo/pricing" },
];

/**
 * Hand-coded "Navigation" pattern: a <nav> landmark with a distinguishing
 * accessible name (important because a page can legitimately have several
 * <nav> regions — header nav, footer nav, breadcrumb, this demo, etc.) and
 * a link list where the active item carries aria-current="page". Clicking
 * a link in this demo just moves the "current" indicator so you can watch
 * aria-current change without leaving this page.
 */
export function NavigationPattern() {
  const [current, setCurrent] = React.useState("home");

  return (
    <nav aria-label="Demo navigation" className="rounded-2xl border border-border bg-card p-4">
      <ul className="flex flex-wrap gap-1">
        {LINKS.map((link) => {
          const active = link.id === current;
          return (
            <li key={link.id}>
              <a
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(link.id);
                }}
                className={
                  "inline-block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors " +
                  (active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

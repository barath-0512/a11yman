"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL_PAGES = 10;

/**
 * Hand-coded APG-adjacent "Pagination" pattern — page 4 of 10, JS-driven
 * (no real URL change per page).
 *
 * A <nav aria-label="Pagination"> landmark lets AT users jump straight to
 * the pagination controls. The current page is marked aria-current="page"
 * (not just visually) so screen readers announce "current page." Previous/
 * Next are real disabled <button>s at the boundaries, not just greyed-out
 * clickable elements. The "…" truncation is purely decorative — it isn't a
 * real control, so it's aria-hidden and not a Tab stop.
 *
 * Because this demo updates page state client-side without changing the
 * URL, a production version of this pattern should also move focus to (or
 * announce) the newly-loaded content region after each page change — see
 * the "Which should I use?" note above for why server-rendered <a href>
 * pagination avoids that extra work entirely.
 */
export function PaginationPattern() {
  const [page, setPage] = React.useState(4);

  const pages = getVisiblePages(page, TOTAL_PAGES);

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        aria-label="Previous page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-secondary"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {pages.map((entry, i) =>
        entry === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
          >
            &#8230;
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            aria-current={entry === page ? "page" : undefined}
            onClick={() => setPage(entry)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium",
              entry === page
                ? "bg-accent text-accent-foreground"
                : "hover:bg-secondary"
            )}
          >
            {entry}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page === TOTAL_PAGES}
        onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
        aria-label="Next page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-secondary"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

/** Builds "1 … 4 5 [6] 7 8 … 42"-style truncated page list. */
function getVisiblePages(current: number, total: number): Array<number | "ellipsis"> {
  const delta = 1;
  const range: Array<number | "ellipsis"> = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("ellipsis");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("ellipsis");
  if (total > 1) range.push(total);

  return range;
}

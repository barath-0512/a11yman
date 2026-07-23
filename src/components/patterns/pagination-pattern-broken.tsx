"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL_PAGES = 10;

/**
 * ⚠ Deliberately broken pagination — for learning only.
 *
 * Defects, on purpose:
 * 1. Previous/Next are <div onClick> elements — not focusable, no keyboard
 *    support, and not announced as buttons by AT. Fails SC 2.1.1 Keyboard
 *    and SC 4.1.2 Name, Role, Value.
 * 2. The Previous button is only visually greyed out on page 1 (a CSS
 *    class) instead of being genuinely disabled — it's still clickable and
 *    still in the tab-adjacent click path, which is a very common
 *    real-world defect. Same for Next on the last page.
 * 3. The current page has no aria-current="page" — sighted users see a
 *    highlight color, but screen reader users have no way to tell which
 *    page they're on. Fails SC 4.1.2 and SC 1.3.1.
 * 4. The "…" ellipsis is a real clickable <button> that does nothing when
 *    activated — a dead, confusing Tab stop for keyboard users. Fails SC
 *    2.1.1 (a focusable control with no operable behavior).
 */
export function PaginationPatternBroken() {
  const [page, setPage] = React.useState(4);
  const pages = getVisiblePages(page, TOTAL_PAGES);

  return (
    <div className="flex items-center gap-1">
      <div
        onClick={() => page > 1 && setPage(page - 1)}
        className={cn(
          "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-sm",
          page === 1 && "opacity-40"
        )}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </div>

      {pages.map((entry, i) =>
        entry === "ellipsis" ? (
          <button
            key={`ellipsis-${i}`}
            type="button"
            className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
          >
            &#8230;
          </button>
        ) : (
          <div
            key={entry}
            onClick={() => setPage(entry)}
            className={cn(
              "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm font-medium",
              entry === page ? "bg-accent text-accent-foreground" : "hover:bg-secondary"
            )}
          >
            {entry}
          </div>
        )
      )}

      <div
        onClick={() => page < TOTAL_PAGES && setPage(page + 1)}
        className={cn(
          "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-sm",
          page === TOTAL_PAGES && "opacity-40"
        )}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </div>
    </div>
  );
}

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

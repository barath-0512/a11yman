import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { TESTING_GUIDES } from "@/lib/testing-guides";

/**
 * Left-pane navigation for testing-guide detail pages: the full list of guides
 * (in the recommended testing order, with the current one highlighted) plus an
 * "All testing guides" back link. Mirrors the component ComponentSidebar.
 * Desktop (lg) only.
 */
export function TestingGuideSidebar({ activeSlug }: { activeSlug: string }) {
  return (
    <aside className="hidden lg:block">
      <div className="lg:sticky lg:top-20 lg:flex lg:max-h-[calc(100dvh-6rem)] lg:flex-col">
        {/* Pinned header: stays put while only the list below scrolls. */}
        <div className="lg:shrink-0">
          <div className="mb-3">
            <p className="text-lg font-semibold tracking-tight">Testing guides</p>
            <p className="text-sm text-muted-foreground">
              {TESTING_GUIDES.length} in total
            </p>
          </div>
          <Link
            href="/how-to-test"
            className="mb-3 inline-flex items-center gap-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All testing guides
          </Link>
        </div>
        {/* Scrollable region — negative margin + padding keep focus rings
            from being clipped by the overflow. */}
        <div className="lg:-mx-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-2 lg:py-1">
        <ul className="space-y-0.5">
          {TESTING_GUIDES.map((g) => {
            const active = g.slug === activeSlug;
            return (
              <li key={g.slug}>
                <Link
                  href={`/how-to-test/${g.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={
                    "block rounded-r-lg border-l-2 py-1.5 pl-2.5 pr-3 text-sm leading-snug transition-colors " +
                    (active
                      ? "border-accent bg-accent/10 font-medium text-accent-text"
                      : "border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground")
                  }
                >
                  {g.title}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 rounded-2xl border border-border bg-secondary/40 p-4">
          <p className="text-sm font-medium">Need the checklist?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            A step-by-step cheat sheet, downloadable as PDF.
          </p>
          <Link
            href="/how-to-test/cheat-sheet"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent-text hover:underline"
          >
            Open cheat sheet
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        </div>
      </div>
    </aside>
  );
}

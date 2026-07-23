import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { COMPONENTS } from "@/lib/components-data";

/**
 * Left-pane navigation for component detail pages: the full component list
 * (alphabetical, with the current one highlighted) plus an "All components"
 * back link. Mirrors the ARIA reference's SidebarNav. Desktop (lg) only.
 */
export function ComponentSidebar({ activeSlug }: { activeSlug: string }) {
  const items = [...COMPONENTS].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <aside className="hidden lg:block">
      <div className="lg:sticky lg:top-20 lg:-mx-2 lg:-my-1 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:px-2 lg:py-1">
        <div className="mb-3">
          <p className="text-lg font-semibold tracking-tight">Components</p>
          <p className="text-sm text-muted-foreground">{items.length} in total</p>
        </div>
        <Link
          href="/components"
          className="mb-3 inline-flex items-center gap-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All components
        </Link>
        <ul className="space-y-0.5">
          {items.map((c) => {
            const active = c.slug === activeSlug;
            return (
              <li key={c.slug}>
                <Link
                  href={`/components/${c.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={
                    "block rounded-r-lg border-l-2 py-1.5 pl-2.5 pr-3 text-sm leading-snug transition-colors " +
                    (active
                      ? "border-accent bg-accent/10 font-medium text-accent-text"
                      : "border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground")
                  }
                >
                  {c.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 rounded-2xl border border-border bg-secondary/40 p-4">
          <p className="text-sm font-medium">Looking for ARIA?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Roles, states &amp; properties reference.
          </p>
          <Link
            href="/aria"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent-text hover:underline"
          >
            Open ARIA reference
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

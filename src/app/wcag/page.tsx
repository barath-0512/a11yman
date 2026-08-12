import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { WCAG_CRITERIA } from "@/lib/wcag";
import { COMPONENTS } from "@/lib/components-data";

export const metadata = pageMetadata({
  title: "WCAG 2.2 Success Criteria Index",
  description:
    "Reverse lookup: pick a WCAG 2.2 success criterion and see which components it applies to.",
  path: "/wcag",
});

export default function WcagIndexPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="container flex-1 pb-16 pt-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight">
              WCAG 2.2 success criteria index
            </h1>
            <p className="text-muted-foreground">
              Pick a success criterion to see which component patterns on
              this site are commonly affected by it — useful for citing
              findings directly in an audit report.
            </p>
          </header>

          <ul className="space-y-3">
            {WCAG_CRITERIA.map((sc) => {
              const applicable = COMPONENTS.filter((c) =>
                c.scIds.includes(sc.id)
              );
              return (
                <li
                  key={sc.id}
                  id={sc.id}
                  className="scroll-mt-24 rounded-2xl border border-border bg-card p-5"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold">
                      {sc.id}
                    </span>
                    <span className="font-medium">{sc.name}</span>
                    <Badge tone={sc.level === "A" ? "neutral" : "accent"}>
                      Level {sc.level}
                    </Badge>
                    <Badge tone="neutral">WCAG {sc.version}</Badge>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {sc.summary}
                  </p>
                  {applicable.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {applicable.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/components/${c.slug}`}
                          className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-secondary"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No mapped component pages yet.
                    </p>
                  )}
                  <a
                    href={sc.understandingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-xs text-accent underline decoration-dotted underline-offset-2"
                  >
                    Read the Understanding doc
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

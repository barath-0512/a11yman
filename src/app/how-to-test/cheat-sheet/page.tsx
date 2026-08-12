import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheatSheetTable } from "@/components/reference/cheat-sheet-table";
import { CheatSheetDownload } from "@/components/reference/cheat-sheet-download";
import { CHEATSHEET, CHEATSHEET_WORKFLOW } from "@/lib/testing-cheatsheet";

export const metadata = pageMetadata({
  title: "Accessibility Testing Cheat Sheet",
  description:
    "A 27-step manual accessibility testing pass — how to test each check, the expected result, and the mapped WCAG 2.2 success criteria. Downloadable as a watermarked PDF.",
  path: "/how-to-test/cheat-sheet",
});

export default function CheatSheetPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="container flex-1 pb-16 pt-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <Link
            href="/how-to-test"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            How to test
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Accessibility testing cheat sheet
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                A {CHEATSHEET.length}-step manual pass you can work
                top-to-bottom — how to test each check, what a pass looks like,
                and the WCAG 2.2 success criteria it maps to.
              </p>
            </div>
            <CheatSheetDownload />
          </div>

          <section aria-labelledby="workflow" className="space-y-3">
            <h2
              id="workflow"
              className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Recommended order
            </h2>
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CHEATSHEET_WORKFLOW.map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-3 text-sm"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent-text">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <CheatSheetTable />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

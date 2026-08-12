import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import {
  Lightbulb,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  BookOpen,
  Keyboard,
  Volume2,
  ListChecks,
  Contrast,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TESTING_GUIDES } from "@/lib/testing-guides";
import { CHEATSHEET } from "@/lib/testing-cheatsheet";

export const metadata = pageMetadata({
  title: "Web Accessibility Testing Guide – WCAG, Screen Readers & Keyboard",
  description:
    "Practical accessibility testing guides and checklists — color contrast, images, keyboard operability, forms, dialogs and more — covering the cross-cutting checks beyond individual components.",
  path: "/how-to-test",
});

const REFERENCES = [
  {
    icon: BookOpen,
    title: "WCAG Index",
    body: "Browse and search all WCAG 2.2 success criteria with plain language and examples.",
    href: "/wcag",
    cta: "Explore WCAG",
    tint: "bg-accent/10 text-accent",
  },
  {
    icon: Keyboard,
    title: "Keyboard Reference",
    body: "Complete list of keyboard keys, shortcuts and patterns used in web interfaces.",
    href: "/keyboard-reference",
    cta: "Open reference",
    tint: "bg-success/10 text-success",
  },
  {
    icon: ListChecks,
    title: "Accessibility Testing Cheat Sheet",
    body: `A ${CHEATSHEET.length}-step manual testing pass with WCAG mapping — downloadable as a watermarked PDF.`,
    href: "/how-to-test/cheat-sheet",
    cta: "Open cheat sheet",
    tint: "bg-warning/10 text-warning",
  },
  {
    icon: Contrast,
    title: "Contrast Analyser",
    body: "Check any colour pair against WCAG 2.2 — live ratio, AA/AAA, and the closest passing colours.",
    href: "/contrast-checker",
    cta: "Open analyser",
    tint: "bg-accent/10 text-accent",
  },
  {
    icon: Volume2,
    title: "Screen Reader Guide",
    body: "Understand how different screen readers announce content and components.",
    href: "/screen-reader-guide",
    cta: "Open guide",
    tint: "bg-accent/10 text-accent",
  },
];

export default function HowToTestPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="container flex-1 pb-16 pt-10">
        <div className="mx-auto max-w-6xl space-y-14">
          {/* Intro + "test with purpose" callout */}
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                How to Test Web Accessibility
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                Practical guides and checklists to help you test accessibility
                and ship with confidence.
              </p>
            </div>
            <div className="flex max-w-md items-start gap-4 rounded-2xl border border-border bg-accent/[0.06] p-5 shadow-soft">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Lightbulb className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <p className="font-medium">Test with purpose</p>
                <p className="text-sm text-muted-foreground">
                  Good testing finds barriers. Great testing removes them.
                </p>
              </div>
            </div>
          </div>

          {/* Testing guides */}
          <section aria-labelledby="testing-guides" className="space-y-6">
            <div className="space-y-1">
              <h2
                id="testing-guides"
                className="text-2xl font-semibold tracking-tight"
              >
                Testing guides
              </h2>
              <p className="text-sm text-muted-foreground">
                Cross-cutting checks that aren&apos;t tied to a single component.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {TESTING_GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/how-to-test/${g.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-accent"
                  >
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <g.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-medium group-hover:text-accent">
                      {g.title}
                    </h3>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">
                      {g.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-text">
                      View guide
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Essential references */}
          <section aria-labelledby="references" className="space-y-6">
            <div className="space-y-1">
              <h2
                id="references"
                className="text-2xl font-semibold tracking-tight"
              >
                Essential references
              </h2>
              <p className="text-sm text-muted-foreground">
                Quick access to key references you&apos;ll use while testing.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REFERENCES.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="group flex h-full gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-accent"
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${r.tint}`}
                    >
                      <r.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="font-semibold group-hover:text-accent">
                        {r.title}
                      </span>
                      <span className="mt-1 text-sm text-muted-foreground">
                        {r.body}
                      </span>
                      <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-accent-text">
                        {r.cta}
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Closing note */}
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-secondary/40 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium">Testing is an ongoing practice</p>
                <p className="text-sm text-muted-foreground">
                  Accessibility changes with content, components and users.
                  Re-test often, fix consistently, and build for everyone.
                </p>
              </div>
            </div>
            <Link
              href="/components"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent"
            >
              Explore all resources
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

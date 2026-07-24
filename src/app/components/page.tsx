import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Code2, ClipboardCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchCombobox } from "@/components/search-combobox";
import { COMPONENTS } from "@/lib/components-data";

export const metadata = pageMetadata({
  title: "Components",
  description:
    "Hand-coded, accessible UI component patterns — with live demos, required ARIA, keyboard models, screen reader announcements, WCAG mapping, and test cases.",
  path: "/components",
});

const CATEGORIES = Array.from(new Set(COMPONENTS.map((c) => c.category)));

const SUMMARY = [
  {
    icon: Code2,
    title: "For developers",
    body: "Semantics, ARIA, keyboard & focus.",
  },
  {
    icon: ClipboardCheck,
    title: "For testers",
    body: "SR output, WCAG & test cases.",
  },
];

export default function ComponentsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="container flex-1 pb-16 pt-10">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Intro + at-a-glance cards */}
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="space-y-4">
              <span className="text-sm font-medium text-muted-foreground">
                Reference
              </span>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Accessible components
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                Build and test accessible components faster. Every example
                includes a live demo, implementation guidance, required ARIA,
                keyboard interactions, screen reader behavior, WCAG mapping, and
                real-world test cases.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {SUMMARY.map((s) => (
                <div
                  key={s.title}
                  className="flex w-full flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-soft sm:w-44"
                >
                  <s.icon className="h-8 w-8 text-foreground" aria-hidden="true" />
                  <p className="mt-3 font-medium">{s.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Long search bar */}
          <SearchCombobox />

          {CATEGORIES.map((category) => (
            <section key={category} aria-labelledby={`cat-${category}`} className="space-y-4">
              <h2
                id={`cat-${category}`}
                className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {category}
              </h2>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {COMPONENTS.filter((c) => c.category === category).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/components/${c.slug}`}
                    className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-accent"
                  >
                    <div className="mb-2">
                      <h3 className="font-medium group-hover:text-accent">{c.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.definition}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

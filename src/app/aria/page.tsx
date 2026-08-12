import { pageMetadata } from "@/lib/seo";
import { Accessibility, Scan, FileText, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AriaExplorer } from "./aria-explorer";

export const metadata = pageMetadata({
  title: "ARIA Roles & Attributes – Accessibility Guide",
  description:
    "A searchable reference of every WAI-ARIA attribute and role — value types, plain-language descriptions, and which a11yman components demonstrate each one.",
  path: "/aria",
});

const SUMMARY = [
  {
    href: "#aria-attributes",
    icon: Accessibility,
    title: "ARIA attributes",
    body: "States and properties you can apply.",
  },
  {
    href: "#aria-roles",
    icon: Scan,
    title: "ARIA roles",
    body: "Types of elements you can create.",
  },
];

export default function AriaPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main id="main" className="container flex-1 pb-16 pt-10">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Intro + at-a-glance cards */}
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="space-y-4">
              <span className="text-sm font-medium text-muted-foreground">
                Accessibility
              </span>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                ARIA reference
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                ARIA (Accessible Rich Internet Applications) is a set of roles
                and attributes that make custom interfaces understandable to
                assistive technologies. Reach for it to express what native HTML
                can&apos;t — and only when a native element genuinely won&apos;t do.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {SUMMARY.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="flex w-full flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-soft transition-colors hover:border-accent sm:w-44"
                >
                  <s.icon className="h-8 w-8 text-foreground" aria-hidden="true" />
                  <p className="mt-3 font-medium">{s.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.body}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Search + attributes table + role cards (all client-filtered) */}
          <AriaExplorer />

          {/* Learn more */}
          <a
            href="https://www.w3.org/WAI/ARIA/apg/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/40 p-5 transition-colors hover:border-accent"
          >
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <span className="space-y-0.5">
              <span className="flex items-center gap-1 font-medium">
                Learn more about ARIA
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </span>
              <span className="block text-sm text-muted-foreground">
                WAI-ARIA Authoring Practices Guide
              </span>
            </span>
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

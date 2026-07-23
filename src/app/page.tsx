import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import {
  ArrowRight,
  Component,
  Accessibility,
  Keyboard,
  Volume2,
  BookOpen,
  Zap,
  Code2,
  ShieldCheck,
  Check,
  Contrast,
  Pipette,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroIllustration } from "@/components/hero-illustration";
import { GlobalSearchCombobox } from "@/components/global-search";
import { COMPONENTS, getComponent } from "@/lib/components-data";
import { ARIA_ATTRIBUTES, ARIA_ROLES } from "@/lib/aria";
import { WCAG_CRITERIA } from "@/lib/wcag";

export const metadata = pageMetadata({
  // The root segment's title bypasses the layout's "%s | a11yman" template, so
  // set the full title explicitly.
  title: "Home | a11yman",
  description:
    "a11yman is a fast, practical reference for building, testing, and understanding accessible UI components — hand-coded patterns, ARIA, keyboard models, screen reader output, and WCAG mapping.",
  path: "/",
});

const FEATURES = [
  { icon: Component, title: "Components", body: "Accessible UI patterns with code, behavior, and examples.", href: "/components", cta: "Browse" },
  { icon: Accessibility, title: "ARIA Reference", body: "Complete guide to ARIA roles, attributes, and relationships.", href: "/aria", cta: "Explore" },
  { icon: Keyboard, title: "Keyboard Reference", body: "Keyboard interactions for components and UI patterns.", href: "/keyboard-reference", cta: "Learn" },
  { icon: Volume2, title: "Screen Reader Guide", body: "Expected announcements for NVDA, JAWS, VoiceOver & more.", href: "/screen-reader-guide", cta: "Open" },
  { icon: BookOpen, title: "WCAG Index", body: "Search WCAG 2.2 success criteria with practical examples.", href: "/wcag", cta: "Browse" },
];

const WHY = [
  { icon: Zap, title: "Faster than documentation", body: "Stop digging through long specs. Find how to build — and how to test — exactly what you need, instantly.", list: [] as string[] },
  { icon: Code2, title: "Built for developers", body: "", list: ["Semantics & ARIA", "Keyboard & focus", "Code examples", "Best practices"] },
  { icon: ShieldCheck, title: "Built for testers", body: "", list: ["Step-by-step test guides", "Screen reader output", "WCAG mapping", "Downloadable cheat sheet"] },
];

const STATS = [
  { value: `${ARIA_ATTRIBUTES.length}`, label: "ARIA Attributes", tone: "text-accent-text" },
  { value: `${ARIA_ROLES.length}`, label: "ARIA Roles", tone: "text-success-text" },
  { value: `${COMPONENTS.length}`, label: "Components", tone: "text-warning-text" },
  { value: `${WCAG_CRITERIA.length}`, label: "WCAG Criteria", tone: "text-destructive-text" },
  { value: "150+", label: "Code Examples", tone: "text-accent-text" },
  { value: "100%", label: "Free & Open", tone: "text-success-text" },
];

const POPULAR = ["button", "dialog", "combobox", "tabs", "menu-button"];

const CHIPS = [
  { label: "button", href: "/components/button" },
  { label: "combobox", href: "/components/combobox" },
  { label: "aria-expanded", href: "/aria/aria-expanded" },
  { label: "dialog", href: "/components/dialog" },
  { label: "2.4.3", href: "/wcag#2.4.3" },
  { label: "aria-labelledby", href: "/aria/aria-labelledby" },
  { label: "1.4.3", href: "/wcag#1.4.3" },
  { label: "carousel", href: "/components/carousel" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* ── Hero ── */}
        <section className="border-b border-border/60 bg-gradient-to-b from-accent/[0.06] to-transparent">
          <div className="container grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
            <div className="space-y-6">
              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Build accessible interfaces without digging through hundreds of
                pages.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                <span className="text-[xx-large] font-semibold tracking-tight text-foreground">
                  a<span className="text-accent">11</span>yman
                </span>{" "}
                is a fast and reliable reference for building, testing, and
                understanding accessible UI components.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/components"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Browse Components
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/aria"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium transition-colors hover:border-accent"
                >
                  Explore ARIA
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by developers and testers building for everyone.
              </p>
            </div>

            {/* Decorative hero illustration */}
            <div aria-hidden="true" className="hidden lg:block">
              <HeroIllustration />
            </div>
          </div>
        </section>

        {/* ── Feature cards ── */}
        <section aria-label="What's inside" className="container -mt-8 pb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {FEATURES.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-accent"
              >
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <f.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </span>
                <h2 className="font-medium">{f.title}</h2>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{f.body}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-text">
                  {f.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Search ── */}
        <section aria-labelledby="find" className="container py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="find"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Find what you need, instantly
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
              Search components, ARIA roles &amp; attributes, and WCAG criteria.
            </p>
            <div className="mx-auto mt-8 max-w-2xl text-left">
              <GlobalSearchCombobox />
            </div>
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {CHIPS.map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    className="inline-flex rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Color contrast checker banner (compact) ── */}
        <section aria-labelledby="contrast-banner" className="container mt-12 pb-16">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-br from-accent/[0.1] via-accent/[0.04] to-transparent p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-text">
                <Pipette className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2
                  id="contrast-banner"
                  className="text-base font-semibold tracking-tight"
                >
                  Color contrast checker
                </h2>
                <p className="text-sm text-muted-foreground">
                  Check any colour pair against WCAG 2.2 — free.
                </p>
              </div>
            </div>
            <Link
              href="/contrast-checker"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              <Contrast className="h-4 w-4" aria-hidden="true" />
              Open
            </Link>
          </div>
        </section>

        {/* ── Why a11yman ── */}
        <section aria-labelledby="why" className="container py-16">
          <h2 id="why" className="text-center text-3xl font-semibold tracking-tight">
            Why a11yman?
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                  <w.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold">{w.title}</h3>
                {w.body && <p className="mt-1.5 text-sm text-muted-foreground">{w.body}</p>}
                {w.list.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {w.list.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Stats ── */}
        <section aria-label="By the numbers" className="container pb-16">
          <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border bg-secondary/40 px-6 py-8 text-center sm:grid-cols-3 lg:grid-cols-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className={`text-3xl font-semibold tracking-tight ${s.tone}`}>{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Popular components ── */}
        <section aria-labelledby="popular" className="container py-8 pb-16">
          <div className="flex items-center justify-between">
            <h2 id="popular" className="text-3xl font-semibold tracking-tight">
              Popular components
            </h2>
            <Link href="/components" className="inline-flex items-center gap-1 text-sm font-medium text-accent-text hover:underline">
              View all components
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {POPULAR.map((slug, i) => {
              const c = getComponent(slug);
              if (!c) return null;
              return (
                <Link
                  key={slug}
                  href={`/components/${slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-accent"
                >
                  {/* Reserve the badge row on every card so all headings start
                      at the same Y, whether or not the card has a tag. */}
                  <div className="mb-2 flex h-5 items-start">
                    {i === 0 && (
                      <span className="inline-flex w-fit rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent-text">
                        Most visited
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium group-hover:text-accent">{c.name}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{c.definition}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-text">
                    Open
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { ArrowLeft, Check, TriangleAlert, Gauge } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageSection } from "@/components/reference/page-section";
import { TestingGuideSidebar } from "@/components/reference/testing-guide-sidebar";
import { TESTING_GUIDES, getTestingGuide } from "@/lib/testing-guides";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return TESTING_GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const guide = getTestingGuide(params.slug);
  if (!guide) return { title: "How to test" };
  return pageMetadata({
    title: `Testing: ${guide.title}`,
    description: guide.intro,
    path: `/how-to-test/${params.slug}`,
  });
}

export default function TestingGuidePage({ params }: { params: Params }) {
  const guide = getTestingGuide(params.slug);
  if (!guide) notFound();

  const { icon: Icon } = guide;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="container flex-1 pb-16 pt-10">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
          <TestingGuideSidebar activeSlug={guide.slug} />
          <div className="min-w-0 space-y-10">
            {/* Mobile back link — the sidebar provides this on desktop */}
            <Link
              href="/how-to-test"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              How to test
            </Link>

          {/* Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {guide.title}
              </h1>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              {guide.intro}
            </p>
          </header>

          {/* What to test */}
          <PageSection id="what-to-test" title="What to test">
            <ul className="space-y-2.5">
              {guide.whatToTest.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </PageSection>

          {/* Thresholds (contrast only) */}
          {guide.thresholds && (
            <PageSection id="thresholds" title="Minimum ratios">
              <dl className="overflow-hidden rounded-2xl border border-border">
                {guide.thresholds.map((t, i) => (
                  <div
                    key={t.label}
                    className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${
                      i > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <dt className="flex items-center gap-2 text-muted-foreground">
                      <Gauge className="h-4 w-4 text-accent" aria-hidden="true" />
                      {t.label}
                    </dt>
                    <dd className="font-mono font-medium">{t.value}</dd>
                  </div>
                ))}
              </dl>
            </PageSection>
          )}

          {/* How to test */}
          <PageSection id="how-to-test" title="How to test">
            <ol className="space-y-4">
              {guide.howToTest.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent-text">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </PageSection>

          {/* Edge cases */}
          {guide.edgeCases && (
            <PageSection id="edge-cases" title="Edge cases">
              <ul className="space-y-4">
                {guide.edgeCases.map((e) => (
                  <li
                    key={e.title}
                    className="rounded-2xl border border-border bg-secondary/30 p-4"
                  >
                    <p className="text-sm font-semibold">{e.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {e.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </PageSection>
          )}

          {/* Common failures */}
          <PageSection id="common-failures" title="Common failures">
            <ul className="space-y-2.5">
              {guide.commonFailures.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <TriangleAlert
                    className="mt-0.5 h-4 w-4 shrink-0 text-warning-text"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </PageSection>

          {/* WCAG mapping */}
          <PageSection id="wcag" title="WCAG 2.2 success criteria">
            <ul className="flex flex-wrap gap-2">
              {guide.criteria.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/wcag#${c.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-accent"
                  >
                    <span className="font-mono font-medium">{c.id}</span>
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {c.level}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </PageSection>

          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

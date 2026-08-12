import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { Badge } from "@/components/ui/badge";
import { ScTable } from "@/components/reference/sc-table";
import { ReferencesList } from "@/components/reference/references-list";
import { PageSection } from "@/components/reference/page-section";
import { LastVerified } from "@/components/reference/last-verified";
import { COMPONENTS, getComponent } from "@/lib/components-data";

export function generateStaticParams() {
  return COMPONENTS.filter((c) => c.status === "planned").map((c) => ({
    slug: c.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const meta = getComponent(params.slug);
  if (!meta) return {};
  return pageMetadata({
    title: `Accessible ${meta.name}`,
    description: `Learn how to build an accessible ${meta.name} with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.`,
    path: `/components/${params.slug}`,
  });
}

export default function ComponentStubPage({
  params,
}: {
  params: { slug: string };
}) {
  const meta = getComponent(params.slug);
  if (!meta || meta.status === "complete") notFound();

  return (
    <ComponentDetailShell slug={params.slug}>
      <div className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">{meta.category}</Badge>
              <Badge tone="warning">Coming soon</Badge>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight">
              Accessible {meta.name}
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              {meta.definition}
            </p>
            <LastVerified date="2026-07-02" />
          </header>

          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-5 text-sm text-muted-foreground">
            The full Developer/Tester mode guide for {meta.name} — live
            demo, native vs. custom code, ARIA and keyboard tables, screen
            reader announcements, defect patterns, and test checklist — is
            not published yet. In the meantime, use the WCAG mapping and
            APG reference below, or see the fully complete{" "}
            <a href="/components/dialog" className="text-accent underline decoration-dotted underline-offset-2">
              Dialog
            </a>
            ,{" "}
            <a href="/components/combobox" className="text-accent underline decoration-dotted underline-offset-2">
              Combobox
            </a>
            ,{" "}
            <a href="/components/accordion" className="text-accent underline decoration-dotted underline-offset-2">
              Accordion
            </a>
            ,{" "}
            <a href="/components/tabs" className="text-accent underline decoration-dotted underline-offset-2">
              Tabs
            </a>{" "}
            and{" "}
            <a href="/components/menu-button" className="text-accent underline decoration-dotted underline-offset-2">
              Menu Button
            </a>{" "}
            pages for the full template.
          </div>

          {meta.nativeElement && (
            <PageSection id="native-hint" title="Native HTML starting point">
              <p className="text-sm text-muted-foreground">
                Prefer <code className="font-mono">{meta.nativeElement}</code>{" "}
                where it meets your requirements — check back for the full
                native-vs-custom comparison.
              </p>
            </PageSection>
          )}

          <PageSection id="wcag" title="WCAG 2.2 success criteria mapping">
            <ScTable scIds={meta.scIds} />
          </PageSection>

          <PageSection id="references" title="References">
            <ReferencesList apgUrl={meta.apgUrl} scIds={meta.scIds} />
          </PageSection>
      </div>
    </ComponentDetailShell>
  );
}

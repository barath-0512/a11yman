"use client";

import { useMode } from "@/components/mode-provider";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/reference/code-block";
import { AriaTable } from "@/components/reference/aria-table";
import { KeyboardTable } from "@/components/reference/keyboard-table";
import { ScTable } from "@/components/reference/sc-table";
import { SrAnnouncementTable } from "@/components/reference/sr-announcement-table";
import { DefectPatterns } from "@/components/reference/defect-patterns";
import { TestChecklist } from "@/components/reference/test-checklist";
import { TestProcedure } from "@/components/reference/test-procedure";
import { BrokenFixedToggle } from "@/components/reference/broken-fixed-toggle";
import { ReferencesList } from "@/components/reference/references-list";
import { PageSection } from "@/components/reference/page-section";
import { LastVerified } from "@/components/reference/last-verified";
import { BreadcrumbPattern } from "@/components/patterns/breadcrumb-pattern";
import { BreadcrumbPatternBroken } from "@/components/patterns/breadcrumb-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("breadcrumb")!;

const NATIVE_CODE = `<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li><a href="/products/laptops">Laptops</a></li>
    <li aria-current="page">ThinkPad X1</li>
  </ol>
</nav>

/* Semantic HTML already covers this pattern completely — the "native" and
   "custom" implementations are the same markup. Separators (/, chevrons)
   are CSS content or aria-hidden icons, never text nodes in the DOM. */`;

const CUSTOM_CODE = NATIVE_CODE;

const ARIA_ROWS = [
  { target: "<nav>", attribute: 'aria-label="Breadcrumb"', why: 'Gives this landmark a distinguishing accessible name so it appears as "Breadcrumb navigation" in a screen reader\'s landmark list, separate from the site\'s main nav.' },
  { target: "<ol>", attribute: "Native ordered list", why: "Communicates that the trail is an ordered sequence of steps from site root to current page, and gives AT users a position count (e.g. \"1 of 4\")." },
  { target: "Last <li> (current page)", attribute: 'aria-current="page"', why: 'Identifies which crumb represents the page the user is currently on — announced as "current page."' },
  { target: "Separator glyph/icon", attribute: 'aria-hidden="true"', why: "Hides the purely decorative visual separator (/, chevron) from assistive tech so it isn't read aloud between every crumb." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves focus through each breadcrumb link in document order — no custom key handling is needed or expected." },
  { keys: "Enter", behavior: "Activates the focused link and navigates to that page." },
];

const SR_ROWS = [
  { step: "Focus enters the breadcrumb nav", jawsChrome: "Breadcrumb navigation landmark, list, 4 items", nvdaFirefox: "Breadcrumb landmark, list with 4 items", voiceOverSafari: "Breadcrumb, navigation" },
  { step: "Tab to the first link", jawsChrome: "Home, link, 1 of 4", nvdaFirefox: "Home, link, 1 of 4", voiceOverSafari: "Home, link, 1 of 4" },
  { step: "Tab to the last (current) item", jawsChrome: "ThinkPad X1, current page", nvdaFirefox: "ThinkPad X1, current page", voiceOverSafari: "ThinkPad X1, current page" },
];

const DEFECTS = [
  { defect: "No <nav aria-label> wrapper around the trail", severity: "High" as const, description: "The breadcrumb never appears in a screen reader's landmark list and can't be distinguished from any other bulleted list on the page. Fails SC 1.3.1 Info and Relationships (in spirit) and reduces navigability." },
  { defect: "Current page rendered as a live link with no aria-current", severity: "Medium" as const, description: "Nothing communicates which crumb is the current page programmatically; sighted users may infer it from styling but AT users cannot. Fails SC 4.1.2 and undermines SC 2.4.8-style location context." },
  { defect: "Separator characters exposed as text nodes", severity: "Low" as const, description: "A screen reader reads \"slash\" aloud between every crumb (\"Home, link, slash, Products, link, slash...\"), adding noise with zero semantic value. Not a hard WCAG failure but a real usability defect worth flagging in an audit." },
];

const TEST_STEPS = [
  { action: "Open the browser's landmark/region list (or NVDA/JAWS landmark navigation).", expected: "A landmark named \"Breadcrumb\" (or \"Breadcrumb navigation\") is listed, distinct from the site's main navigation." },
  { action: "Tab through each breadcrumb link.", expected: "Each link announces its label, link role, and position (e.g. \"2 of 4\")." },
  { action: "Tab to the final crumb.", expected: "It announces as the current page (not as a link) and is not separately clickable." },
  { action: "Listen through the whole trail with a screen reader.", expected: "Separator glyphs (/, chevrons) are never announced between crumbs." },
];

const CHECKLIST = [
  "The breadcrumb trail is wrapped in <nav aria-label=\"Breadcrumb\"> (or an equivalent distinguishing label).",
  "The trail is marked up as an ordered list (<ol>) of links.",
  "The current/last page is marked with aria-current=\"page\" and is not an active link to itself.",
  "Visual separators are aria-hidden or implemented via CSS ::before content, never as readable text nodes.",
  "All links are reachable and operable using only the keyboard, in visual order.",
  "The breadcrumb landmark is distinguishable from the site's primary navigation landmark in a landmark list.",
];

export function BreadcrumbPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{meta.category}</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
          There's only one right way to build a breadcrumb: a labeled{" "}
          <code className="font-mono">&lt;nav&gt;</code> landmark wrapping an{" "}
          <code className="font-mono">&lt;ol&gt;</code> of real links, with the
          current page marked by{" "}
          <code className="font-mono">aria-current="page"</code>. Semantic HTML
          already covers this completely — there's no ARIA widget to reach for,
          so the native and custom approaches are identical.
        </div>
        <div className="mt-4 space-y-3">
          <BreadcrumbPattern />
          <CodeBlock code={CUSTOM_CODE} filename="breadcrumb-pattern.tsx" />
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <BreadcrumbPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <BreadcrumbPatternBroken />
            </div>
          }
        />
      </PageSection>

      {mode === "developer" ? (
        <>
          <PageSection id="aria" title="Required roles, states & properties">
            <AriaTable rows={ARIA_ROWS} />
          </PageSection>
          <PageSection id="keyboard" title="Keyboard interaction model">
            <KeyboardTable rows={KEYBOARD_ROWS} />
          </PageSection>
          <PageSection id="focus" title="Focus management rules">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>No custom focus management is required — the browser's native Tab order through the links is correct as-is.</li>
              <li>The current page is not a focus stop unless it remains a real link; when rendered as plain text it is correctly skipped.</li>
              <li>Activating a crumb link navigates the page normally, so focus naturally resets to the top of the destination document.</li>
            </ul>
          </PageSection>
        </>
      ) : (
        <>
          <PageSection id="test-procedure" title="Keyboard test procedure">
            <TestProcedure steps={TEST_STEPS} />
          </PageSection>
          <PageSection id="sr-announcements" title="Expected screen reader announcements">
            <SrAnnouncementTable rows={SR_ROWS} />
          </PageSection>
          <PageSection id="defects" title="Common defect patterns">
            <DefectPatterns items={DEFECTS} />
          </PageSection>
          <PageSection id="checklist" title="Test case checklist">
            <TestChecklist componentName={meta.name} items={CHECKLIST} />
          </PageSection>
        </>
      )}

      <PageSection id="wcag" title="WCAG 2.2 success criteria mapping">
        <ScTable scIds={meta.scIds} />
      </PageSection>

      <PageSection id="references" title="References">
        <ReferencesList apgUrl={meta.apgUrl} scIds={meta.scIds} />
      </PageSection>
    </div>
  );
}

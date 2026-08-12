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
import { NavigationPattern } from "@/components/patterns/navigation-pattern";
import { NavigationPatternBroken } from "@/components/patterns/navigation-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("navigation")!;

const NATIVE_CODE = `<nav aria-label="Main">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/docs">Docs</a></li>
  </ul>
</nav>

<footer>
  <nav aria-label="Footer">
    <ul>...</ul>
  </nav>
</footer>

<!-- Semantic HTML already covers this pattern completely. Every <nav>
     gets a distinguishing aria-label since a page can have more than
     one, and the current page's link is marked with aria-current. -->`;

const CUSTOM_CODE = NATIVE_CODE;

const ARIA_ROWS = [
  { target: "Each <nav>", attribute: "aria-label (distinguishing)", why: 'A page commonly has more than one navigation landmark (header, footer, breadcrumb, in-page). Each needs a unique accessible name so a landmark list reads "Main navigation," "Footer navigation," etc. instead of three identical "navigation" entries.' },
  { target: "Active link", attribute: 'aria-current="page"', why: "Identifies which link in the nav represents the page currently being viewed — announced as \"current page\" and commonly used as a CSS hook for the active-state style." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves through each nav link in document order — no arrow-key or roving-tabindex behavior is expected for a plain link list." },
];

const SR_ROWS = [
  { step: "User opens the landmark/region list", jawsChrome: "Banner, Main navigation, Main, Footer navigation, Content info", nvdaFirefox: "Main navigation landmark, Main landmark, Footer navigation landmark", voiceOverSafari: "Main navigation, Main, Footer navigation" },
  { step: "Focus reaches the active link", jawsChrome: "Home, link, current page", nvdaFirefox: "Home, current page, link", voiceOverSafari: "Home, current page, link" },
];

const DEFECTS = [
  { defect: "Multiple <nav> elements with no aria-label", severity: "High" as const, description: "A screen reader's landmark list shows \"navigation, navigation, navigation\" with no way to distinguish header nav from footer nav from an in-page nav. Fails SC 1.3.1 / 2.4.1 in spirit and severely hurts landmark-based navigation." },
  { defect: "No aria-current on the active nav link", severity: "Medium" as const, description: "There is no programmatic indication of which page is currently active; sighted users may infer it from a visual style AT users can't perceive. Fails SC 4.1.2 / 1.3.1." },
];

const TEST_STEPS = [
  { action: "Open a screen reader's landmark/region list.", expected: "Each navigation region has a distinct, descriptive name (e.g. \"Main,\" \"Footer\") — never duplicate unlabeled \"navigation\" entries." },
  { action: "Tab through the demo nav below and activate a link.", expected: "The activated link is announced as the current page (aria-current) and this is reflected visually too." },
];

const CHECKLIST = [
  "Every <nav> landmark on the page has a unique, descriptive aria-label (or accessible name) when more than one exists.",
  "The link representing the current page carries aria-current=\"page\".",
  "Heading hierarchy on the page is logical and doesn't skip levels.",
  "All navigation links are reachable and operable using only the keyboard, in a sensible visual order.",
  "Landmark regions (banner, navigation, main, contentinfo) are verified with a landmarks browser extension or AT landmark list.",
];

export function NavigationPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{meta.category}</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Accessible {meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
          Landmark structure needs no JavaScript widget at all: a labeled{" "}
          <code className="font-mono">&lt;nav&gt;</code> for each distinct group
          of navigation links, and{" "}
          <code className="font-mono">aria-current="page"</code> on the active
          link. Semantic HTML is the whole solution, so the native and custom
          approaches are identical. (Bypassing that repeated navigation is its
          own concern — see the{" "}
          <a
            href="/components/skip-link"
            className="text-accent-text underline decoration-dotted underline-offset-2"
          >
            Skip Link
          </a>{" "}
          component.)
        </div>
        <div className="mt-4 space-y-3">
          <NavigationPattern />
          <CodeBlock code={CUSTOM_CODE} filename="navigation.html" />
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <p className="text-sm text-muted-foreground">
          This demo nav is scoped with its own{" "}
          <code className="font-mono">aria-label="Demo navigation"</code> so
          it doesn't collide with this site's real header/footer navigation
          when you test landmarks on this page. Click a link to move the
          "current page" indicator.
        </p>
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <NavigationPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <NavigationPatternBroken />
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
              <li>No roving tabindex or arrow-key handling is expected — a nav link list uses plain sequential Tab order.</li>
              <li>Focus moves through links in document order; the active link (aria-current) does not change the tab sequence.</li>
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

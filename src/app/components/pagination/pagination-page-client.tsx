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
import { PaginationPattern } from "@/components/patterns/pagination-pattern";
import { PaginationPatternBroken } from "@/components/patterns/pagination-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("pagination")!;

const HTML_CODE = `<!-- A <nav> landmark labelled "Pagination". Each page is a real link
     with its own URL — so it works without JS, and the server renders
     the right window of numbers. The current page is marked
     aria-current="page". The … gaps are decorative (aria-hidden),
     never focusable controls. -->
<nav aria-label="Pagination">
  <a href="?page=3" rel="prev">Previous</a>

  <a href="?page=1">1</a>
  <span aria-hidden="true">…</span>
  <a href="?page=3">3</a>
  <a href="?page=4" aria-current="page">4</a>
  <a href="?page=5">5</a>
  <span aria-hidden="true">…</span>
  <a href="?page=12">12</a>

  <a href="?page=5" rel="next">Next</a>
</nav>`;

const ARIA_ROWS = [
  { target: "Wrapping element", attribute: '<nav aria-label="Pagination">', why: "Creates a labeled navigation landmark so AT users can jump straight to the pagination controls, distinguishing it from other <nav> landmarks on the page (e.g. primary site nav)." },
  { target: "Current page control", attribute: 'aria-current="page"', why: "Identifies which page is currently displayed so AT announces \"current page\" — required in addition to any visual highlight, not instead of it." },
  { target: "Previous / Next controls", attribute: "disabled attribute (real, not just styled)", why: "A genuinely disabled button is skipped in the tab order and announced as unavailable, rather than remaining clickable while merely looking greyed out." },
  { target: "Ellipsis (…)", attribute: 'aria-hidden="true", non-interactive element', why: "The truncation marker conveys no operable function, so it must not be a button or a Tab stop — it's purely decorative and should be hidden from AT." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab", behavior: "Moves forward through Previous, each visible page link/button, and Next in document order. Disabled boundary controls are skipped." },
  { keys: "Shift + Tab", behavior: "Moves backward through the same controls." },
  { keys: "Enter / Space", behavior: "Activates the focused page link or Previous/Next control." },
];

const SR_ROWS = [
  { step: "User tabs into the pagination landmark", jawsChrome: "Pagination navigation", nvdaFirefox: "Pagination landmark", voiceOverSafari: "Pagination, navigation" },
  { step: "Focus reaches the current page control", jawsChrome: "4, current page", nvdaFirefox: "4, current page, link", voiceOverSafari: "4, current page" },
  { step: "Focus reaches Previous on page 1 (real disabled button)", jawsChrome: "Previous page, unavailable", nvdaFirefox: "Previous page, dimmed", voiceOverSafari: "Previous page, dimmed, button" },
  { step: "Focus passes the ellipsis", jawsChrome: "(nothing announced — not a stop)", nvdaFirefox: "(nothing announced — not a stop)", voiceOverSafari: "(nothing announced — not a stop)" },
];

const DEFECTS = [
  { defect: "Previous/Next are <div onClick> with no keyboard support", severity: "Critical" as const, description: "Keyboard-only users cannot reach or activate Previous/Next at all — there is no Tab stop and no Enter/Space handling. Fails SC 2.1.1 Keyboard and SC 4.1.2 Name, Role, Value." },
  { defect: "Previous button is visually disabled but still clickable on page 1", severity: "High" as const, description: "Sighted mouse users can still click a greyed-out Previous control that should be inert, while its true state is never communicated to AT since it isn't a real disabled control. Fails SC 4.1.2." },
  { defect: "Current page has no aria-current=\"page\"", severity: "High" as const, description: "Screen reader users have no way to determine which page they're currently viewing — only a color change communicates it, and only to sighted users. Fails SC 1.3.1 Info and Relationships and SC 4.1.2." },
  { defect: "Ellipsis is a focusable, clickable dead button", severity: "Medium" as const, description: "The \"…\" truncation marker is implemented as a <button> that does nothing when activated, creating a confusing, purposeless Tab stop for keyboard users. Fails SC 2.1.1." },
];

const TEST_STEPS = [
  { action: "Tab into the pagination controls from the preceding content.", expected: "Screen reader announces entry into a \"Pagination\" navigation landmark." },
  { action: "Continue tabbing through the page links.", expected: "Each page number is announced with its value; the current page is announced with \"current page.\"" },
  { action: "Tab past the ellipsis, if present.", expected: "The ellipsis is not a Tab stop — focus moves directly from one page number to the next visible one." },
  { action: "On the first page, tab to Previous.", expected: "Previous is either skipped entirely or announced as unavailable/disabled — it is never an active, clickable control." },
  { action: "Activate a page number with Enter or Space.", expected: "The displayed content updates to that page, and aria-current moves to the newly selected page control." },
];

const CHECKLIST = [
  "Pagination controls are wrapped in a <nav> with an accessible name (e.g. aria-label=\"Pagination\").",
  "The current page has aria-current=\"page\" in addition to any visual highlight.",
  "Previous/Next are genuinely disabled (not just visually dimmed) at the first/last page.",
  "All page links/buttons are reachable and operable via Tab and Enter/Space alone.",
  "The ellipsis truncation marker is aria-hidden and not a focusable/clickable element.",
  "If pagination is JS-driven (no real URL per page), focus or an announcement moves to the newly loaded content after each page change.",
];

export function PaginationPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Navigation</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <PaginationPattern />
          {mode === "developer" && <CodeBlock code={HTML_CODE} filename="pagination.html" />}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <PaginationPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <PaginationPatternBroken />
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
              <li>Tab order follows visual/document order: Previous, then each visible page control, then Next.</li>
              <li>Disabled Previous/Next controls are removed from the tab order entirely, not just visually dimmed.</li>
              <li>The decorative ellipsis is never a Tab stop.</li>
              <li>For JS-driven (non-URL) pagination, move focus to or announce the newly loaded content region after each page change — don't leave focus stranded on a control that scrolled out of view.</li>
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

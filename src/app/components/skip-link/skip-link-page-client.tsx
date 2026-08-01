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
import { ReferencesList } from "@/components/reference/references-list";
import { PageSection } from "@/components/reference/page-section";
import { LastVerified } from "@/components/reference/last-verified";
import { SkipLinkPattern } from "@/components/patterns/skip-link-pattern";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("skip-link")!;

const HTML_CODE = `<!-- The FIRST focusable element in the document, before header/nav. -->
<a href="#main" class="skip-link">Skip to main content</a>

<header> <!-- logo + site navigation --> </header>

<!-- tabindex="-1" lets activating the link move keyboard FOCUS to
     <main> (not just scroll it into view). The next Tab then continues
     from here, past the repeated navigation. No ARIA needed — it's a
     plain anchor. -->
<main id="main" tabindex="-1">
  ...
</main>`;

const CSS_CODE = `/* Visually hidden until it receives keyboard focus, then clearly shown. */
.skip-link {
  position: absolute;
  left: -9999px;          /* off-screen, but still focusable */
}

.skip-link:focus {
  position: fixed;
  left: 1rem;
  top: 1rem;              /* reveal on focus, with strong focus styles */
  z-index: 100;
}`;

const ARIA_ROWS = [
  {
    target: "Skip link",
    attribute: '<a href="#main">',
    why: "A plain anchor pointing at the main region's id. No ARIA is needed — the First Rule of ARIA applies; a native link already exposes the right role and keyboard behavior.",
  },
  {
    target: "Target region",
    attribute: '<main id="main"> + tabindex="-1"',
    why: "The id is the link's destination; tabindex=-1 makes the region programmatically focusable so activating the link moves focus there. Without it, some browsers only scroll and leave focus stranded in the nav.",
  },
  {
    target: "Skip link",
    attribute: "sr-only until :focus (CSS, not ARIA)",
    why: "The link is hidden off-screen so it doesn't affect the visual layout, and revealed on :focus so keyboard users see it. It must never use display:none or visibility:hidden, which would also remove it from the focus order.",
  },
];

const KEYBOARD_ROWS = [
  { keys: "Tab (first press on the page)", behavior: "Focuses the skip link, which becomes visible as the very first stop — before the logo, header, and navigation." },
  { keys: "Enter", behavior: "Follows the link, moving focus to the main content region and bypassing all repeated navigation." },
  { keys: "Tab (again, after skipping)", behavior: "Continues from inside the main content — it does not jump back to the top of the navigation." },
];

const SR_ROWS = [
  { step: "Page loads, user presses Tab once", jawsChrome: "Skip to main content, link", nvdaFirefox: "Skip to main content, link", voiceOverSafari: "Skip to main content, link" },
  { step: "Enter pressed on the skip link", jawsChrome: "main region, Main content", nvdaFirefox: "main landmark, Main content", voiceOverSafari: "Main content, main" },
];

const DEFECTS = [
  { defect: "No skip link at all", severity: "High" as const, description: "Keyboard and screen reader users must Tab through the entire repeated header/navigation on every single page before reaching main content. Fails SC 2.4.1 Bypass Blocks." },
  { defect: "Skip link only scrolls, doesn't move focus", severity: "Medium" as const, description: "The target region has no tabindex=\"-1\", so activating the link scrolls the page but leaves keyboard focus inside the navigation — the next Tab re-enters the nav, defeating the purpose. Fails SC 2.4.1." },
  { defect: "Skip link hidden with display:none / visibility:hidden", severity: "High" as const, description: "Hiding it this aggressively removes it from the focus order entirely, so it can never be reached or activated by keyboard. Use an off-screen (sr-only) technique instead. Fails SC 2.4.1 / 2.1.1." },
  { defect: "Skip link is not the first focusable element", severity: "Medium" as const, description: "Other controls (cookie banner, logo, search) receive focus before the skip link, so users still can't bypass the repeated content up front. Fails SC 2.4.1 / 2.4.3." },
];

const TEST_STEPS = [
  { action: "Load any page of this site and press Tab exactly once.", expected: "A \"Skip to content\" link becomes visible and focused as the very first stop, with a clear focus indicator." },
  { action: "Press Enter on the skip link.", expected: "Focus moves into the main content region, past the header navigation entirely." },
  { action: "Press Tab once more.", expected: "Focus continues from inside main content — it does not return to the top of the navigation." },
  { action: "Confirm nothing is focusable before the skip link.", expected: "The skip link is genuinely the first item in the Tab order (first focusable element in the DOM)." },
];

const CHECKLIST = [
  "A \"skip to main content\" link is the first focusable element on the page.",
  "It is visually hidden until focused, then clearly visible with a strong focus indicator.",
  "It uses an off-screen (sr-only) technique — never display:none or visibility:hidden.",
  "Activating it moves keyboard focus (not merely scroll) into the main content region.",
  "The target region has an id and tabindex=\"-1\" (or is a natively focusable heading).",
  "The next Tab after skipping continues from inside main, not back at the top of the nav.",
  "The mechanism works consistently on every page and template.",
];

export function SkipLinkPageClient() {
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
            A skip link is just a native anchor whose{" "}
            <code className="font-mono">href</code> points at the id of the main
            content region — there's no ARIA and no JavaScript widget, so the
            native and custom approaches are identical. The only two details
            that matter: hide it until it's focused (using an off-screen
            technique, never <code className="font-mono">display:none</code>),
            and give the target{" "}
            <code className="font-mono">tabindex="-1"</code> so activating the
            link moves focus there rather than only scrolling. This very site's
            header implements one you can try right now — press Tab once on any
            page.
          </div>
          <div className="mt-4 space-y-3">
            <SkipLinkPattern />
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "skip-link.html", code: HTML_CODE },
                { label: "CSS", filename: "skip-link.css", code: CSS_CODE },
              ]}
            />
          </div>
        </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <p className="text-sm text-muted-foreground">
          This skip link targets a demo region scoped to this example (its own{" "}
          <code className="font-mono">#skip-demo-main</code>), separate from the
          site's real skip link. Press Tab from the top of the demo to reveal
          it, then Enter to jump past the demo navigation.
        </p>
        <SkipLinkPattern />
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
              <li>The skip link is the first focusable element in the DOM — before the logo, header, and navigation.</li>
              <li>Its target carries tabindex="-1" so activating it moves focus (not just scroll) into the main region; the next Tab continues from there.</li>
              <li>It is visually hidden until focused, then shown with a clear, high-contrast focus style so sighted keyboard users can see it.</li>
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

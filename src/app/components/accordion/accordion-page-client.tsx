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
import { AccordionPattern } from "@/components/patterns/accordion-pattern";
import { AccordionPatternBroken } from "@/components/patterns/accordion-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("accordion")!;

const HTML_CODE = `<!-- Each section: an <h3> wrapping the trigger <button>, then its
     region panel. aria-expanded reflects the open state; aria-controls
     and aria-labelledby wire header and panel together. Collapsed
     panels use the hidden attribute. -->
<div class="accordion">
  <h3>
    <button id="acc-shipping-header" aria-expanded="true"
            aria-controls="acc-shipping-panel">Shipping</button>
  </h3>
  <div id="acc-shipping-panel" role="region"
       aria-labelledby="acc-shipping-header">
    <!-- panel content -->
  </div>

  <h3>
    <button id="acc-returns-header" aria-expanded="false"
            aria-controls="acc-returns-panel">Returns</button>
  </h3>
  <div id="acc-returns-panel" role="region"
       aria-labelledby="acc-returns-header" hidden>
    <!-- panel content -->
  </div>
</div>`;

const JS_CODE = `const accordion = document.querySelector(".accordion");
const headers = [...accordion.querySelectorAll("[aria-controls]")];

headers.forEach((header, i) => {
  const panel = document.getElementById(header.getAttribute("aria-controls"));

  // Toggle this section. Several sections may be open at once — a
  // single-open accordion would just collapse the others here.
  header.addEventListener("click", () => {
    const expanded = header.getAttribute("aria-expanded") === "true";
    header.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
  });

  // Arrow keys move focus between headers; Home/End jump to the ends.
  header.addEventListener("keydown", (e) => {
    let next = null;
    if (e.key === "ArrowDown") next = (i + 1) % headers.length;
    if (e.key === "ArrowUp") next = (i - 1 + headers.length) % headers.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = headers.length - 1;
    if (next === null) return;
    e.preventDefault();
    headers[next].focus();
  });
});`;

const ARIA_ROWS = [
  { target: "Header <button>", attribute: "aria-expanded", why: 'Communicates whether this section\'s panel is currently visible — announced as "expanded" or "collapsed."' },
  { target: "Header <button>", attribute: "aria-controls", why: "Associates the header with the panel id it toggles, so AT can relate the two even though they aren't nested." },
  { target: "Panel", attribute: 'role="region" + aria-labelledby', why: "Lets a screen reader user jump directly to an open panel via landmark/region navigation, labeled by its header." },
  { target: "Header wrapper", attribute: "Native heading element (h3)", why: "Keeps the accordion navigable via a screen reader's heading list, independent of the ARIA toggle semantics." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves focus into and out of the accordion, stopping only on header buttons (collapsed panels are not in the tab order)." },
  { keys: "Enter / Space", behavior: "Toggles the focused header's panel open or closed." },
  { keys: "Down Arrow", behavior: "Moves focus to the next header." },
  { keys: "Up Arrow", behavior: "Moves focus to the previous header." },
  { keys: "Home / End", behavior: "Moves focus to the first / last header." },
];

const SR_ROWS = [
  { step: "Focus lands on a collapsed header", jawsChrome: "Returns, button, collapsed, heading level 3", nvdaFirefox: "heading level 3, Returns, collapsed, button", voiceOverSafari: "Returns, collapsed, button" },
  { step: "Space pressed, panel opens", jawsChrome: "Expanded", nvdaFirefox: "expanded", voiceOverSafari: "expanded" },
  { step: "Screen reader user browses by heading", jawsChrome: "Reads each header text at heading level 3, including expanded/collapsed state", nvdaFirefox: "Reads each header text at heading level 3, including expanded/collapsed state", voiceOverSafari: "Reads each header text, including expanded/collapsed state" },
];

const DEFECTS = [
  { defect: "Header implemented as a <div> instead of a <button>", severity: "Critical" as const, description: "The accordion header cannot receive keyboard focus and has no default Enter/Space activation, making the whole component unusable without a mouse. Fails SC 2.1.1 and 4.1.2." },
  { defect: "Missing aria-expanded", severity: "High" as const, description: "Screen reader users cannot tell whether a section is currently open or closed before activating it. Fails SC 4.1.2 Name, Role, Value." },
  { defect: "Panel content remains in the tab order while collapsed", severity: "Medium" as const, description: "Tabbing through a collapsed section still stops on links/buttons hidden inside its panel, creating confusing 'phantom' stops with no visible context. Fails SC 2.4.3 Focus Order." },
  { defect: "Arrow keys not supported between headers", severity: "Low" as const, description: "Tab-only navigation between headers still works but doesn't match the APG interaction model testers and power users expect. Not a WCAG failure by itself, but flag as a usability defect." },
];

const TEST_STEPS = [
  { action: "Tab to the first accordion header.", expected: "Screen reader announces the header text, button role, and expanded/collapsed state." },
  { action: "Press Space or Enter.", expected: "Panel visibility toggles; state announcement updates to match (expanded/collapsed)." },
  { action: "Press Down Arrow.", expected: "Focus moves to the next header, regardless of whether the current panel is open or closed." },
  { action: "Press End, then Home.", expected: "Focus jumps to the last header, then back to the first." },
  { action: "Tab past an open panel's header.", expected: "Focus lands on any focusable content inside the open panel before reaching the next header." },
  { action: "Collapse a panel that has focus inside it.", expected: "Focus moves to a sensible location (typically the section's own header) — it never becomes lost or stuck on a now-hidden element." },
];

const CHECKLIST = [
  "All accordion headers are reachable and operable using only the keyboard.",
  "Each header is a real <button> (or has role=\"button\" plus full keyboard handling if that's unavoidable).",
  "aria-expanded is present on every header and reflects true state at all times.",
  "aria-controls correctly points at the associated panel's id.",
  "Collapsed panel content is not present in the Tab order.",
  "Arrow Up/Down/Home/End move focus between headers per the APG pattern.",
  "Heading levels are correct and consistent (verify with a heading-structure tool).",
  "Visual focus indicator is visible on every header at every zoom level up to 200%.",
];

export function AccordionPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Disclosure</Badge>
          <Badge tone="neutral">Flagship guide</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <AccordionPattern />
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "accordion.html", code: HTML_CODE },
                { label: "JS", filename: "accordion.js", code: JS_CODE },
              ]}
            />
          )}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <AccordionPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <AccordionPatternBroken />
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
              <li>Only header buttons are ever in the Tab order — panel content is never reachable while its panel is collapsed.</li>
              <li>Toggling a panel never moves focus away from its header.</li>
              <li>Arrow Up/Down/Home/End move focus directly between headers, independent of open/closed state.</li>
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

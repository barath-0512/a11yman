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
import { DisclosurePattern } from "@/components/patterns/disclosure-pattern";
import { DisclosurePatternBroken } from "@/components/patterns/disclosure-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("disclosure")!;

const CUSTOM_CODE = `function DisclosurePattern() {
  const [expanded, setExpanded] = useState(false);
  const panelId = "disclosure-pattern-panel";

  return (
    <div>
      <button
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded(e => !e)}
      >
        Advanced options
      </button>
      <div id={panelId} hidden={!expanded}>
        {/* panel content */}
      </div>
    </div>
  );
}`;

const ARIA_ROWS = [
  { target: "Trigger <button>", attribute: "aria-expanded", why: 'Communicates whether the panel is currently visible — announced as "expanded" or "collapsed." Must update synchronously with every toggle.' },
  { target: "Trigger <button>", attribute: "aria-controls", why: "Associates the trigger with the panel id it toggles, so AT can relate the two even though they aren't nested." },
  { target: "Panel", attribute: "hidden attribute", why: "Removes the panel and everything inside it from the accessibility tree and the tab order while collapsed — stronger than a CSS-only visual hide." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves focus to and from the trigger button; panel content is only reachable via Tab when the panel is expanded." },
  { keys: "Enter / Space", behavior: "Toggles the panel open or closed." },
];

const SR_ROWS = [
  { step: "Focus lands on the collapsed trigger", jawsChrome: "Advanced options, button, collapsed", nvdaFirefox: "Advanced options, button, collapsed", voiceOverSafari: "Advanced options, collapsed, button" },
  { step: "Space pressed, panel opens", jawsChrome: "Expanded", nvdaFirefox: "expanded", voiceOverSafari: "expanded" },
  { step: "Tab into the now-visible panel", jawsChrome: "Request timeout (seconds), edit text", nvdaFirefox: "Request timeout (seconds), edit text", voiceOverSafari: "Request timeout (seconds), text field" },
];

const DEFECTS = [
  { defect: "Trigger implemented as a <div> instead of a <button>", severity: "Critical" as const, description: "The trigger cannot receive keyboard focus and has no default Enter/Space activation, making the disclosure unusable without a mouse. Fails SC 2.1.1 and 4.1.2." },
  { defect: "aria-expanded never updates after mount", severity: "Critical" as const, description: "The panel visibly opens and closes but the programmatic state is frozen at its initial value, actively misinforming assistive tech rather than simply omitting information. Fails SC 4.1.2." },
  { defect: "Panel hidden via CSS max-height/overflow instead of the hidden attribute", severity: "Medium" as const, description: "Collapsed panel content remains present in the tab order; a keyboard user can tab into fields with no visible focus indicator, since the field is scrolled/clipped out of view. Fails SC 2.4.3 and 2.4.7." },
];

const TEST_STEPS = [
  { action: "Tab to the disclosure trigger.", expected: "Screen reader announces the trigger label, button role, and collapsed state." },
  { action: "Press Enter or Space.", expected: "Panel becomes visible; announcement updates to expanded." },
  { action: "Continue tabbing.", expected: "Focus moves into the now-visible panel content (e.g. the timeout field) before reaching the next page element." },
  { action: "Collapse the panel while focus is inside it.", expected: "Focus moves to a sensible location (typically the trigger) — it never becomes lost or stuck on now-hidden content." },
];

const CHECKLIST = [
  "The trigger is a real <button> (or has role=\"button\" plus full keyboard handling if that's unavoidable).",
  "aria-expanded is present on the trigger and updates synchronously with every toggle.",
  "aria-controls correctly points at the panel's id.",
  "Collapsed panel content is removed from the tab order (verify with Tab key, not just visually).",
  "Visible focus indicator is present on the trigger at every zoom level up to 200%.",
];

export function DisclosurePageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Disclosure</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <DisclosurePattern />
          {mode === "developer" && <CodeBlock code={CUSTOM_CODE} filename="disclosure-pattern.tsx" />}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <DisclosurePattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <DisclosurePatternBroken />
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
              <li>Panel content is only in the Tab order while expanded — collapsed content is never reachable.</li>
              <li>Toggling the panel never moves focus away from the trigger.</li>
              <li>There is no arrow-key model — a disclosure is a single control, not a group like Accordion.</li>
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

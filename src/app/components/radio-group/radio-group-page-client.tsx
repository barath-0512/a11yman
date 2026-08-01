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
import { RadioGroupPattern } from "@/components/patterns/radio-group-pattern";
import { RadioGroupPatternBroken } from "@/components/patterns/radio-group-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("radio-group")!;

const HTML_CODE = `<!-- Prefer native <input type="radio"> in a <fieldset>. Use this custom
     version only when the native control can't be styled to spec.
     role="radiogroup" + role="radio" recreate the semantics; the roving
     tabindex makes the whole group a single Tab stop. -->
<div role="radiogroup" aria-label="Shipping speed">
  <button role="radio" aria-checked="true"  tabindex="0"  data-value="standard">Standard</button>
  <button role="radio" aria-checked="false" tabindex="-1" data-value="express">Express</button>
  <button role="radio" aria-checked="false" tabindex="-1" data-value="overnight">Overnight</button>
</div>`;

const JS_CODE = `const group = document.querySelector('[role="radiogroup"]');
const radios = [...group.querySelectorAll('[role="radio"]')];

function select(radio) {
  radios.forEach((r) => {
    const checked = r === radio;
    r.setAttribute("aria-checked", String(checked));
    r.tabIndex = checked ? 0 : -1; // roving tabindex: only one Tab stop
  });
  radio.focus();
}

radios.forEach((radio, i) => {
  radio.addEventListener("click", () => select(radio));
  radio.addEventListener("keydown", (e) => {
    let next = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % radios.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + radios.length) % radios.length;
    if (next === null) return;
    e.preventDefault();
    select(radios[next]); // arrowing selects immediately — no separate step
  });
});`;

const ARIA_ROWS = [
  { target: "Group wrapper", attribute: 'role="radiogroup"', why: "Identifies the container as a set of mutually exclusive options, distinct from an unrelated list of buttons." },
  { target: "Group wrapper", attribute: "aria-label (or aria-labelledby)", why: "Gives the group itself an accessible name (e.g. \"Shipping speed\") announced when a screen reader user enters it." },
  { target: "Each option <button>", attribute: 'role="radio"', why: 'Overrides default button semantics so AT announces "radio button" and exposes the checked state below.' },
  { target: "Each option <button>", attribute: "aria-checked", why: "Communicates which single option is currently selected; exactly one radio in the group should be true at a time." },
  { target: "Each option <button>", attribute: "tabIndex (roving 0 / -1)", why: "Only the selected option (or the first, before any selection) is in the Tab order — matching native <input type=\"radio\"> grouping behavior, where arrow keys move between the rest." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves focus into or out of the whole group, landing only on the currently selected option (roving tabindex)." },
  { keys: "Arrow Down / Right", behavior: "Moves focus to the next option AND selects it immediately — radio groups select-on-arrow, unlike tabs where activation mode is configurable." },
  { keys: "Arrow Up / Left", behavior: "Moves focus to the previous option AND selects it immediately." },
  { keys: "Space", behavior: "Selects the focused option (redundant with arrow-key selection, but expected for consistency with checkboxes)." },
];

const SR_ROWS = [
  { step: "Tab into the group for the first time", jawsChrome: "Shipping speed, Standard, radio button, 1 of 3, checked", nvdaFirefox: "Shipping speed, radio group, Standard, checked, radio button 1 of 3", voiceOverSafari: "Shipping speed, Standard, selected, radio button, 1 of 3" },
  { step: "Arrow Down pressed", jawsChrome: "Express, radio button, 2 of 3, checked", nvdaFirefox: "Express, checked, radio button 2 of 3", voiceOverSafari: "Express, selected, radio button, 2 of 3" },
  { step: "Tab out of the group", jawsChrome: "(moves to next focusable element on the page; no radios re-announced)", nvdaFirefox: "(moves to next focusable element on the page; no radios re-announced)", voiceOverSafari: "(moves to next focusable element on the page; no radios re-announced)" },
];

const DEFECTS = [
  { defect: "Every option is a separately-focusable <div>", severity: "Critical" as const, description: "All three options carry tabIndex={0}, so each is an individual Tab stop instead of only the selected one — breaking the roving-tabindex model users expect and bloating the tab sequence with redundant stops. Fails SC 2.1.1 in spirit and creates a non-standard interaction." },
  { defect: "Missing role=\"radiogroup\" / role=\"radio\" / aria-checked", severity: "Critical" as const, description: "A screen reader announces plain, unrelated blocks of text with no indication these options are mutually exclusive or which one is currently selected. Fails SC 4.1.2." },
  { defect: "No arrow key support", severity: "High" as const, description: "There is no way to move between and select options using arrow keys — every option must be individually Tab'd to and clicked with a mouse, contradicting both the native <input type=\"radio\"> model and the APG radio group pattern. Fails SC 2.1.1." },
  { defect: "No visible focus indicator on the selected option after arrowing", severity: "Medium" as const, description: "Even once keyboard support is added, forgetting to move DOM focus (not just visual state) when the selection changes via arrow keys leaves sighted keyboard users unable to see where focus actually is." },
];

const TEST_STEPS = [
  { action: "Tab to the radio group.", expected: "Focus lands only on the currently selected option (or the first option if none is selected); screen reader announces the group label, option label, radio role, position (e.g. \"1 of 3\"), and checked state." },
  { action: "Press Arrow Down (or Right).", expected: "Focus moves to the next option AND that option becomes selected immediately — no separate activation step required." },
  { action: "Press Arrow Up (or Left) from the last option.", expected: "Focus wraps to the previous option in the group and selects it." },
  { action: "Tab away from the group, then Shift+Tab back.", expected: "Focus returns directly to the currently selected option, not the first option in list order." },
  { action: "With a screen reader running, arrow through all options.", expected: "Each option's label, position (e.g. \"2 of 3\"), and checked state are announced as focus moves — no option is silently skipped." },
];

const CHECKLIST = [
  "Only the selected option (or the first, if none selected) is reachable via Tab — the rest are reached only by arrow keys.",
  "Arrow keys move focus and change the selection in a single action, matching native radio button behavior.",
  "The group has role=\"radiogroup\" (or is a native <fieldset>) with an accessible name via aria-label, aria-labelledby, or <legend>.",
  "Each option has role=\"radio\" (or is a native <input type=\"radio\">) with aria-checked accurately reflecting state.",
  "Exactly one option in the group is checked/selected at any time — never zero after initial selection, never more than one.",
  "Visible focus indicator is present and moves correctly as arrow keys are used.",
  "Each option meets the 24x24 CSS pixel minimum target size.",
];

export function RadioGroupPageClient() {
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
        <div className="space-y-3">
          <RadioGroupPattern />
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "radio-group.html", code: HTML_CODE },
                { label: "JS", filename: "radio-group.js", code: JS_CODE },
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
              <RadioGroupPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <RadioGroupPatternBroken />
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
              <li>Only one option is ever in the Tab order at a time: the selected option, or the first option before any selection is made.</li>
              <li>Arrow keys move focus between options AND change the selection in the same action — there is no separate &quot;confirm&quot; step.</li>
              <li>Tabbing out of and back into the group always returns focus to the currently selected option, not the first in list order.</li>
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

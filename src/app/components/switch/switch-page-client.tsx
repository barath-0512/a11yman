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
import { SwitchPattern } from "@/components/patterns/switch-pattern";
import { SwitchPatternBroken } from "@/components/patterns/switch-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("switch")!;

const CUSTOM_CODE = `function SwitchPattern() {
  const [on, setOn] = useState(true);

  function toggle() { setOn(v => !v); }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby="wifi-switch-label"
      onClick={toggle}
      onKeyDown={e => {
        if (e.key === " ") { e.preventDefault(); toggle(); }
      }}
    >
      <span aria-hidden="true" className="thumb" />
    </button>
  );
}

/* role="switch" (not "checkbox") is what makes AT announce
   "switch, on/off" — matching the instant-effect mental model a toggle
   switch implies, vs. a checkbox that often implies "apply on submit." */`;

const ARIA_ROWS = [
  { target: "Switch <button>", attribute: 'role="switch"', why: 'Announced as "switch," distinct from role="checkbox" — communicates an instant on/off effect rather than a form value applied later.' },
  { target: "Switch <button>", attribute: "aria-checked", why: "A strict boolean (true/false only — switches have no mixed state) reflecting on/off. Announced as \"on\"/\"off\" by most screen readers instead of \"checked\"/\"not checked.\"" },
  { target: "Switch <button>", attribute: "aria-labelledby (or aria-label)", why: "Gives the switch an accessible name, since the visible label text (e.g. \"Wi-Fi\") is a separate element, not the button's own text content." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves focus to/from the switch like any other control." },
  { keys: "Space", behavior: "Toggles the switch on/off." },
  { keys: "Enter", behavior: "Also toggles the switch — <button> fires onClick for both Enter and Space natively, so no extra handling is required." },
];

const SR_ROWS = [
  { step: "Focus lands on the switch (currently on)", jawsChrome: "Wi-Fi, switch, on", nvdaFirefox: "Wi-Fi, switch, on", voiceOverSafari: "Wi-Fi, on, switch button" },
  { step: "Space pressed, switch turns off", jawsChrome: "off", nvdaFirefox: "off", voiceOverSafari: "off" },
  { step: "Native checkbox-styled-as-switch (no switch attribute) receives focus", jawsChrome: "Wi-Fi, checkbox, checked", nvdaFirefox: "Wi-Fi, checkbox, checked", voiceOverSafari: "Wi-Fi, checked, checkbox" },
];

const DEFECTS = [
  { defect: "Built from a <div> with a sliding CSS animation", severity: "Critical" as const, description: "No default focusability and no keydown handling — the toggle can only be operated with a mouse or touch. Keyboard-only users cannot turn the setting on or off. Fails SC 2.1.1." },
  { defect: "Missing role=\"switch\" and aria-checked", severity: "Critical" as const, description: "A screen reader announces only the adjacent label text, with no indication an interactive control exists nearby or what its current state is. Fails SC 4.1.2." },
  { defect: "No visible focus indicator", severity: "Medium" as const, description: "Because the element is never a real focusable control, there is no way to tell via keyboard alone that the switch currently has focus. Fails SC 2.4.7 once focusability is fixed." },
  { defect: "Relying on the experimental switch attribute as the only accessibility layer", severity: "Low" as const, description: "Shipping <input type=\"checkbox\" switch> without a role=\"switch\" fallback means users on browser/AT combinations that don't yet support the attribute hear \"checkbox\" instead of \"switch\" with no fallback semantics. Not a hard WCAG failure, but flag as a robustness risk given current support levels." },
];

const TEST_STEPS = [
  { action: "Tab to the switch.", expected: "Screen reader announces the label (e.g. \"Wi-Fi\"), the word \"switch,\" and the current state (\"on\" or \"off\")." },
  { action: "Press Space.", expected: "The switch's visual state flips (e.g. slider moves side to side) and the announced state updates immediately to match." },
  { action: "Press Enter.", expected: "The switch also toggles — confirm both Space and Enter work, since <button> supports both natively." },
  { action: "Zoom the page to 200%.", expected: "The switch remains fully visible, operable, and its target size still meets the 24x24 CSS pixel minimum." },
  { action: "With a screen reader running, compare a checkbox-styled-as-switch to a role=\"switch\" control.", expected: "Confirm which one announces \"switch\" vs. \"checkbox\" on your test browser/AT combination, and document the difference for testers." },
];

const CHECKLIST = [
  "Switch is reachable and operable using only the keyboard (Tab to focus, Space or Enter to toggle).",
  "Switch has role=\"switch\" with aria-checked accurately reflecting on/off state at all times.",
  "Switch has an accessible name via visible label + aria-labelledby, or aria-label.",
  "Toggling the switch never moves focus away from it.",
  "If using a native checkbox styled as a switch, confirmed and documented which screen readers announce it as \"checkbox\" vs. \"switch\" for your supported AT matrix.",
  "Visible focus indicator is present at every zoom level up to 200%.",
  "Switch meets the 24x24 CSS pixel minimum target size.",
];

export function SwitchPageClient() {
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
          <SwitchPattern />
          {mode === "developer" && <CodeBlock code={CUSTOM_CODE} filename="switch-pattern.tsx" />}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <SwitchPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <SwitchPatternBroken />
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
              <li>The switch is always a single Tab stop — there's no roving tabindex or sub-navigation involved.</li>
              <li>Toggling the switch never moves focus away from it, so users can flip several switches in a row with repeated Space presses.</li>
              <li>Changing a switch's state must never trigger an unexpected context change (e.g. navigating away or opening a dialog) per SC 3.2.2 On Input.</li>
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

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
import { SliderPattern } from "@/components/patterns/slider-pattern";
import { SliderPatternBroken } from "@/components/patterns/slider-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("slider")!;

const CUSTOM_CODE = `function SliderPattern() {
  const [value, setValue] = useState(60);

  function onKeyDown(e) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setValue(v => clamp(v + STEP)); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setValue(v => clamp(v - STEP)); }
    else if (e.key === "PageUp") { e.preventDefault(); setValue(v => clamp(v + BIG_STEP)); }
    else if (e.key === "PageDown") { e.preventDefault(); setValue(v => clamp(v - BIG_STEP)); }
    else if (e.key === "Home") { e.preventDefault(); setValue(MIN); }
    else if (e.key === "End") { e.preventDefault(); setValue(MAX); }
  }

  return (
    <div onPointerDown={(e) => setFromClientX(e.clientX)}> {/* click-on-track jump */}
      <div
        role="slider"
        tabIndex={0}
        aria-labelledby="volume-label"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={value}
        aria-valuetext={\`\${value}%\`}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}`;

const ARIA_ROWS = [
  { target: "Thumb", attribute: 'role="slider"', why: "Identifies the focusable thumb element as a slider control to AT." },
  { target: "Thumb", attribute: "aria-valuemin / aria-valuemax", why: "Communicates the slider's minimum and maximum possible values." },
  { target: "Thumb", attribute: "aria-valuenow", why: "Communicates the current numeric value, updated on every change." },
  { target: "Thumb", attribute: "aria-valuetext", why: "Overrides the announced value with a human-meaningful string when the raw number alone isn't meaningful (e.g. \"Medium\" instead of \"2\"); here it's used to announce \"60%\" instead of a bare \"60.\"" },
  { target: "Thumb", attribute: "aria-labelledby / aria-label", why: "Gives the slider an accessible name, e.g. \"Volume,\" so it isn't announced as an unnamed slider." },
  { target: "Thumb", attribute: "tabIndex={0}", why: "Makes the thumb keyboard-focusable, since a bare <div> is not focusable by default." },
];

const KEYBOARD_ROWS = [
  { keys: "Right Arrow / Up Arrow", behavior: "Increases the value by one step." },
  { keys: "Left Arrow / Down Arrow", behavior: "Decreases the value by one step." },
  { keys: "Home", behavior: "Jumps to the minimum value." },
  { keys: "End", behavior: "Jumps to the maximum value." },
  { keys: "Page Up", behavior: "Increases the value by a larger step (10x the normal step, for sliders with a wide range)." },
  { keys: "Page Down", behavior: "Decreases the value by a larger step." },
];

const SR_ROWS = [
  { step: "Thumb receives focus", jawsChrome: "Volume, slider, 60%", nvdaFirefox: "Volume, slider, 60%", voiceOverSafari: "Volume, slider, 60%" },
  { step: "Right Arrow pressed", jawsChrome: "61%", nvdaFirefox: "61%", voiceOverSafari: "61%" },
  { step: "Page Up pressed", jawsChrome: "71%", nvdaFirefox: "71%", voiceOverSafari: "71%" },
  { step: "Home pressed", jawsChrome: "0%, minimum", nvdaFirefox: "0%", voiceOverSafari: "0%, minimum value" },
];

const DEFECTS = [
  { defect: "Thumb has no role=\"slider\" or aria-value* attributes", severity: "Critical" as const, description: "A screen reader announces nothing meaningful about the control's purpose, current value, or range when it receives focus. Fails SC 4.1.2 Name, Role, Value." },
  { defect: "Thumb is not focusable (no tabIndex)", severity: "Critical" as const, description: "Keyboard users cannot reach the control at all via Tab. Fails SC 2.1.1 Keyboard." },
  { defect: "No keyboard support — value only changes by dragging", severity: "Critical" as const, description: "Arrow keys, Home, End, and Page Up/Down do nothing; there is no way to change the value without a mouse drag. Fails SC 2.1.1 and SC 2.5.7 Dragging Movements." },
  { defect: "No click-on-track jump, drag-only interaction", severity: "Medium" as const, description: "Pointer users who can click but not perform a precise drag gesture (common with some motor impairments and switch devices) have no single-pointer alternative to reach a given value. Contributes to a SC 2.5.7 failure alongside the missing keyboard support." },
];

const TEST_STEPS = [
  { action: "Tab to the slider thumb.", expected: "Screen reader announces the accessible name, role \"slider,\" and the current value (e.g. \"Volume, slider, 60%\")." },
  { action: "Press Right Arrow several times.", expected: "Value increases by one step each press; each new value is announced." },
  { action: "Press Page Up.", expected: "Value jumps by a larger increment (10x the normal step) in one press." },
  { action: "Press Home, then End.", expected: "Value jumps to the minimum, then the maximum, and each is announced." },
  { action: "Click directly on the track away from the thumb (no drag).", expected: "The thumb jumps immediately to the clicked position — a single click is sufficient, no drag gesture required." },
];

const CHECKLIST = [
  "Thumb has role=\"slider\" and is a real, focusable element (not a decorative div with no tabIndex).",
  "aria-valuemin, aria-valuemax, and aria-valuenow are present and update live as the value changes.",
  "aria-valuetext is used instead of (or in addition to) aria-valuenow when the raw number isn't self-explanatory.",
  "Arrow keys (and Home/End/Page Up/Page Down) fully operate the slider without a mouse.",
  "A single click/tap on the track — not just a drag — moves the thumb to that value.",
  "The accessible name (aria-label or aria-labelledby) is present and describes what the slider controls.",
];

export function SliderPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Forms &amp; Controls</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <SliderPattern />
          {mode === "developer" && <CodeBlock code={CUSTOM_CODE} filename="slider-pattern.tsx" />}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <SliderPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <SliderPatternBroken />
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
              <li>The thumb itself is the single Tab stop for the whole control — there's nothing else to tab through.</li>
              <li>Clicking anywhere on the track moves focus to the thumb and jumps the value to that position.</li>
              <li>Focus never leaves the thumb while dragging or using arrow keys; the value updates in place.</li>
              <li>A visible focus ring on the thumb must remain visible at every value, including at the min/max ends of the track.</li>
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

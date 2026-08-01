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
import { TooltipPattern } from "@/components/patterns/tooltip-pattern";
import { TooltipPatternBroken } from "@/components/patterns/tooltip-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("tooltip")!;

const HTML_CODE = `<span class="tooltip-wrap">
  <button id="help-btn">Help</button>

  <!-- role="tooltip" is linked to the trigger via aria-describedby,
       which JS adds only while the tip is shown. Starts hidden. -->
  <span id="help-tip" role="tooltip" hidden>
    We'll only use this to recover your account.
  </span>
</span>`;

const JS_CODE = `const trigger = document.getElementById("help-btn");
const tip = document.getElementById("help-tip");
let hideTimer;

function show() {
  clearTimeout(hideTimer);
  tip.hidden = false;
  trigger.setAttribute("aria-describedby", "help-tip");
}

function hide() {
  tip.hidden = true;
  trigger.removeAttribute("aria-describedby");
}

// Delay lets the pointer travel from the trigger onto the tooltip
// without it vanishing (SC 1.4.13, "hoverable").
function scheduleHide() {
  hideTimer = setTimeout(hide, 150);
}

// Pointer users (note the tip itself is hoverable, so it stays open):
trigger.addEventListener("mouseenter", show);
trigger.addEventListener("mouseleave", scheduleHide);
tip.addEventListener("mouseenter", show);
tip.addEventListener("mouseleave", scheduleHide);

// Keyboard users MUST get it too — on focus, not just hover.
trigger.addEventListener("focus", show);
trigger.addEventListener("blur", hide);

// Escape dismisses it while focus stays on the trigger (SC 1.4.13).
trigger.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hide();
});`;

const ARIA_ROWS = [
  {
    target: "Tooltip popup",
    attribute: 'role="tooltip"',
    why: "Identifies the popup as supplementary description text, not an interactive widget or landmark.",
  },
  {
    target: "Trigger element",
    attribute: "aria-describedby",
    why: "Programmatically links the trigger to the tooltip's id so a screen reader announces the tooltip text as a description whenever the trigger is focused — this is the whole mechanism; without it the tooltip is invisible to AT even if it's visible on screen.",
  },
  {
    target: "Tooltip popup content",
    attribute: "Text only, no interactive children",
    why: "A tooltip must not contain links, buttons, or form controls. Content that needs to be interactive belongs in a Popover-style pattern instead.",
  },
];

const KEYBOARD_ROWS = [
  { keys: "Tab (to the trigger)", behavior: "Shows the tooltip — focus alone must trigger it, not just mouse hover." },
  { keys: "Shift+Tab / Tab (away)", behavior: "Hides the tooltip as focus leaves the trigger." },
  { keys: "Escape (while trigger has focus)", behavior: "Hides the tooltip without moving focus away from the trigger (dismissible, per SC 1.4.13)." },
];

const SR_ROWS = [
  {
    step: "Trigger receives focus, tooltip shows",
    jawsChrome: "Bold, button, Bold (Ctrl+B)",
    nvdaFirefox: "Bold, button, Bold (Ctrl+B)",
    voiceOverSafari: "Bold, button, Bold (Ctrl+B)",
  },
  {
    step: "Escape pressed while trigger has focus",
    jawsChrome: "(tooltip dismissed visually; trigger name/role re-announced only if focus is queried again)",
    nvdaFirefox: "(tooltip dismissed visually; trigger name/role re-announced only if focus is queried again)",
    voiceOverSafari: "(tooltip dismissed visually; trigger name/role re-announced only if focus is queried again)",
  },
  {
    step: "Focus moves away from the trigger",
    jawsChrome: "Next focusable element's name and role",
    nvdaFirefox: "Next focusable element's name and role",
    voiceOverSafari: "Next focusable element's name and role",
  },
];

const DEFECTS = [
  {
    defect: "Tooltip only shows on mouseenter, no onFocus handler",
    severity: "Critical" as const,
    description:
      "Keyboard-only users, and anyone using switch access, can tab directly to the trigger but the tooltip never appears because it is wired exclusively to mouse events. The supplementary information is entirely unavailable to them. Fails SC 2.1.1 Keyboard.",
  },
  {
    defect: "Missing aria-describedby",
    severity: "Critical" as const,
    description:
      "The tooltip text is visually shown but never programmatically associated with the trigger. A screen reader user who focuses the trigger hears only its name (e.g. \"Bold, button\") with no indication the supplementary tooltip content exists. Fails SC 1.4.13 and 4.1.2.",
  },
  {
    defect: "No Escape / dismiss mechanism",
    severity: "Medium" as const,
    description:
      "Once shown, the tooltip can only be hidden by moving the pointer away or shifting focus — there's no way to dismiss it while keeping focus on the trigger, and it may obscure content beneath it. Fails SC 1.4.13 (dismissible).",
  },
  {
    defect: "Tooltip disappears before the pointer can reach it",
    severity: "Low" as const,
    description:
      "For tooltips positioned with any gap from the trigger, hiding immediately on mouseleave (no grace-period delay) means a pointer moving toward the tooltip itself never gets a chance to hover it. Fails SC 1.4.13 (hoverable) when the tooltip content is non-trivial in size.",
  },
];

const TEST_STEPS = [
  { action: "Tab to a control with a tooltip (do not use the mouse).", expected: "The tooltip appears purely from keyboard focus, with no pointer involvement." },
  { action: "With a screen reader running, tab to the same control.", expected: "The trigger's name and role are announced, immediately followed by the tooltip text as a description." },
  { action: "With the tooltip visible, press Escape.", expected: "The tooltip hides; focus remains on the trigger (not moved elsewhere)." },
  { action: "Hover the trigger with a mouse, then move the pointer toward the tooltip itself.", expected: "The tooltip does not disappear the instant the pointer leaves the trigger — it stays visible long enough to reach it." },
  { action: "Hover the trigger with a mouse and wait without moving.", expected: "The tooltip remains visible and readable, not hidden by a short arbitrary timer." },
];

const CHECKLIST = [
  "Tooltip appears on keyboard focus of the trigger, not only on mouse hover.",
  "Trigger has aria-describedby pointing at the tooltip's id.",
  "Tooltip popup has role=\"tooltip\".",
  "Tooltip contains only non-interactive text — no links, buttons, or form controls inside it.",
  "Escape hides the tooltip while the trigger keeps focus (dismissible).",
  "Tooltip does not disappear before a pointer can move onto it, when the tooltip has meaningful size (hoverable).",
  "Tooltip stays visible until dismissed or focus/hover moves away — not hidden by a too-short arbitrary timer (persistent).",
  "Tooltip text has sufficient color contrast against its background.",
];

export function TooltipPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Overlays</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Shows on hover AND focus, role=&quot;tooltip&quot; with
            aria-describedby, Escape to dismiss, and a brief hover-delay so
            the pointer can reach the tooltip itself.
          </p>
          <TooltipPattern label="Bold" tooltip="Bold (Ctrl+B)" />
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "tooltip.html", code: HTML_CODE },
                { label: "JS", filename: "tooltip.js", code: JS_CODE },
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
              <TooltipPattern label="Bold" tooltip="Bold (Ctrl+B)" />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <TooltipPatternBroken label="Bold" tooltip="Bold (Ctrl+B)" />
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
              <li>The tooltip never receives focus itself — it is purely supplementary to whatever element is already focused.</li>
              <li>Focusing the trigger shows the tooltip; blurring the trigger hides it.</li>
              <li>Escape hides the tooltip while leaving focus exactly where it was, on the trigger.</li>
              <li>A short close delay on mouseleave lets the pointer travel from the trigger onto the tooltip content itself without it disappearing mid-move.</li>
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

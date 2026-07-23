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
import { ButtonPattern } from "@/components/patterns/button-pattern";
import { ButtonPatternBroken } from "@/components/patterns/button-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("button")!;

const NATIVE_CODE = `<button type="button">Save changes</button>

<button type="button" aria-pressed="false">Favorite</button>

/* Focusable, correct role, and Enter+Space activation all come free.
   aria-pressed is the one attribute a toggle button still has to set
   itself — there's no native HTML "pressed" state. */`;

const ARIA_ROWS = [
  { target: "Plain action <button>", attribute: "(none required)", why: "Native button semantics — role, focusability, and Enter/Space activation — are exposed automatically by the browser." },
  { target: "Toggle <button>", attribute: "aria-pressed", why: 'Communicates on/off state as "pressed" or "not pressed." Unlike aria-expanded on a disclosure, this is never automatic — you must set and update it yourself, even on a real <button>.' },
  { target: "role=\"button\" div (custom ARIA)", attribute: 'role="button", tabIndex="0"', why: "Manually restores the button role and Tab-focusability that a real <button> would provide automatically. Shown only to illustrate why this reimplementation is unnecessary." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves focus to and from the button in the page's natural tab order." },
  { keys: "Enter", behavior: "Activates the button. Fires on keydown." },
  { keys: "Space", behavior: "Activates the button. Fires on keyup, not keydown — this lets a user press Space, change their mind, and move focus away before releasing to cancel the action, without it firing. (Native browser behavior, not something you implement.)" },
];

const SR_ROWS = [
  { step: "Focus lands on plain action button", jawsChrome: "Save changes, button", nvdaFirefox: "Save changes, button", voiceOverSafari: "Save changes, button" },
  { step: "Focus lands on toggle button, not pressed", jawsChrome: "Favorite, button, not pressed", nvdaFirefox: "Favorite, toggle button, not pressed", voiceOverSafari: "Favorite, button" },
  { step: "Toggle button activated, now pressed", jawsChrome: "Favorited, button, pressed", nvdaFirefox: "Favorited, toggle button, pressed", voiceOverSafari: "Favorited, button, selected" },
];

const DEFECTS = [
  { defect: "Toggle built from <div onClick> with no role or tabIndex", severity: "Critical" as const, description: "The control is completely absent from the accessibility tree as an interactive element and cannot receive keyboard focus at all. Fails SC 2.1.1 and 4.1.2." },
  { defect: "No keydown handling on a non-native control", severity: "Critical" as const, description: "Even where a div is made focusable, without explicit Enter/Space handling nothing happens when a keyboard user tries to activate it. Fails SC 2.1.1." },
  { defect: "Missing aria-pressed on a toggle button", severity: "High" as const, description: "The control visibly changes state on click, but screen reader users are never told it has a pressed/not-pressed state or which one is current — the state is a lie to assistive tech. Fails SC 4.1.2." },
  { defect: "Space handled on keydown instead of keyup on a custom control", severity: "Low" as const, description: "Deviates from native button behavior (activation on release), removing the user's ability to cancel by dragging focus away before releasing Space. Not a WCAG failure, but a usability regression worth flagging." },
];

const TEST_STEPS = [
  { action: "Tab to the plain action button.", expected: "Screen reader announces the label and button role; a visible focus ring appears." },
  { action: "Press Enter, then press Space on a separate visit.", expected: "Both keys activate the button." },
  { action: "Tab to the toggle button.", expected: "Screen reader announces the label, button role, and current pressed state (e.g. \"not pressed\")." },
  { action: "Press Enter or Space to activate the toggle.", expected: "State flips; screen reader announcement updates to the new pressed state on next focus/re-announcement." },
  { action: "Tab to the custom ARIA (role=\"button\" div) example and press Space.", expected: "The button activates and the page does not scroll." },
];

const CHECKLIST = [
  "Every actionable control is a real <button> element unless there is a documented, unavoidable reason it cannot be.",
  "Toggle buttons expose aria-pressed and update it synchronously with the visible state change.",
  "Both Enter and Space activate every button-role control, including any hand-rolled role=\"button\" elements.",
  "Space does not scroll the page when pressed on a custom (non-native) button-role element.",
  "Every button has a visible focus indicator at every zoom level up to 200%.",
  "Icon-only toggle buttons (e.g. a star icon with no visible text) have an accessible name via visible text, aria-label, or visually-hidden text — not just the icon.",
];

export function ButtonPageClient() {
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
          <ButtonPattern />
          {mode === "developer" && <CodeBlock code={NATIVE_CODE} filename="button-pattern.tsx" />}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <p className="text-sm text-muted-foreground">
          A plain action button and a toggle button (aria-pressed), fixed vs.
          a mouse-only broken variant.
        </p>
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <ButtonPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <ButtonPatternBroken />
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
              <li>Buttons participate in the page's natural Tab order — no roving tabindex or focus trapping is involved.</li>
              <li>Activating a button never moves focus unless the button's documented purpose is to move focus (e.g. opening a dialog).</li>
              <li>A visible focus indicator must be present at every zoom level up to 200%, per SC 2.4.7 / 2.4.11.</li>
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

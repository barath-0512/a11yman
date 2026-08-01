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
import { CheckboxPattern } from "@/components/patterns/checkbox-pattern";
import { CheckboxPatternBroken } from "@/components/patterns/checkbox-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("checkbox")!;

const HTML_CODE = `<!-- Native checkboxes give you the role, focus, Space to toggle, and
     label association for free. "mixed" (indeterminate) is the one
     state with no HTML attribute — you set it from JS (see the JS tab). -->
<ul>
  <li>
    <input type="checkbox" id="notify-all" />
    <label for="notify-all">Notify me about everything</label>
  </li>
  <li>
    <input type="checkbox" class="child" id="notify-email" />
    <label for="notify-email">Email</label>
  </li>
  <li>
    <input type="checkbox" class="child" id="notify-sms" />
    <label for="notify-sms">SMS</label>
  </li>
</ul>`;

const JS_CODE = `const parent = document.getElementById("notify-all");
const children = [...document.querySelectorAll(".child")];

// The parent's state is always DERIVED from the children, never stored
// separately — that's what keeps "mixed" honest.
function syncParent() {
  const checkedCount = children.filter((c) => c.checked).length;
  parent.checked = checkedCount === children.length;
  // "mixed": some but not all children are checked.
  parent.indeterminate = checkedCount > 0 && checkedCount < children.length;
}

parent.addEventListener("change", () => {
  children.forEach((c) => (c.checked = parent.checked));
});

children.forEach((c) => c.addEventListener("change", syncParent));
syncParent();`;

const ARIA_ROWS = [
  { target: 'Checkbox <button>', attribute: 'role="checkbox"', why: 'Overrides the button\'s default semantics so AT announces "checkbox" and reads the state below instead of a generic pressed/not-pressed toggle.' },
  { target: 'Checkbox <button>', attribute: 'aria-checked="true"|"false"|"mixed"', why: 'The literal string "mixed" is what lets a screen reader announce "partially checked" for a parent whose children are only partly selected — a plain boolean can\'t express that third state.' },
  { target: 'Checkbox <button>', attribute: 'Accessible name (visible text or aria-label)', why: 'Every checkbox needs a programmatically associated name so AT can announce what is being checked, per SC 4.1.2 and 2.5.3 Label in Name.' },
  { target: 'Native <input type="checkbox">', attribute: '.indeterminate (DOM property, not an attribute)', why: 'Sets the visual mixed dash and the accessible "mixed" exposure for a native checkbox; must be set via ref in an effect since JSX has no matching prop.' },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves focus to the next/previous checkbox in the group." },
  { keys: "Space", behavior: "Toggles the focused checkbox. Enter is intentionally not bound — checkboxes only respond to Space, unlike buttons or links." },
];

const SR_ROWS = [
  { step: "Focus lands on an unchecked child checkbox", jawsChrome: "SMS notifications, checkbox, not checked", nvdaFirefox: "SMS notifications, checkbox not checked", voiceOverSafari: "SMS notifications, unchecked, checkbox" },
  { step: "Space pressed, checkbox becomes checked", jawsChrome: "checked", nvdaFirefox: "checked", voiceOverSafari: "checked" },
  { step: "Focus lands on \"Select all\" when 1 of 3 children is checked", jawsChrome: "Select all, checkbox, partially checked", nvdaFirefox: "Select all, partially checked, checkbox", voiceOverSafari: "Select all, mixed, checkbox" },
  { step: "\"Select all\" activated, all children become checked", jawsChrome: "Select all, checked", nvdaFirefox: "Select all, checked", voiceOverSafari: "Select all, checked" },
];

const DEFECTS = [
  { defect: "Checkbox built from a <div> with an onClick handler", severity: "Critical" as const, description: "No default focusability and no keyboard activation whatsoever — keyboard-only users cannot check or uncheck anything. Fails SC 2.1.1 and 4.1.2." },
  { defect: "Missing role=\"checkbox\" and aria-checked", severity: "Critical" as const, description: "A screen reader announces the element as plain, non-interactive text with no indication a control exists or what its state is. Fails SC 4.1.2." },
  { defect: "\"Select all\" never reflects a mixed state", severity: "High" as const, description: "When some but not all child checkboxes are checked, the parent still renders as either fully checked or fully unchecked, silently misrepresenting the real selection to every user. A very common real-world defect in hand-rolled \"select all\" controls. Fails SC 4.1.2." },
  { defect: "No visible focus indicator", severity: "Medium" as const, description: "Because the fake checkbox is never a real focusable element, there is no way to determine via keyboard alone which control currently has focus. Fails SC 2.4.7 once basic focusability is fixed." },
];

const TEST_STEPS = [
  { action: "Tab to the \"Select all\" checkbox.", expected: "Screen reader announces checkbox role, label \"Select all,\" and current state (checked, not checked, or partially checked)." },
  { action: "Press Space on \"Select all\" when no children are checked.", expected: "All child checkboxes become checked; \"Select all\" announces checked." },
  { action: "Tab to a single child checkbox and press Space to uncheck it.", expected: "That checkbox announces not checked; focus stays on it." },
  { action: "Tab back to \"Select all.\"", expected: "Announces partially checked / mixed, since 2 of 3 children are now checked." },
  { action: "Press Space on \"Select all\" again.", expected: "All children become unchecked in one action; \"Select all\" announces not checked." },
];

const CHECKLIST = [
  "Every checkbox is reachable and operable using only the keyboard (Tab to focus, Space to toggle).",
  "Each checkbox has role=\"checkbox\" (or is a native <input type=\"checkbox\">) with an accessible name.",
  "aria-checked reflects true/false accurately at all times, including immediately after toggling.",
  "A \"select all\"/parent control correctly exposes a mixed/indeterminate state when only some children are checked.",
  "Native tri-state checkboxes set .indeterminate imperatively — verify it is not left stale after children change.",
  "Enter does not toggle the checkbox; only Space does.",
  "Visible focus indicator is present on every checkbox at every zoom level up to 200%.",
  "Checkbox and its label together meet the 24x24 CSS pixel minimum target size.",
];

export function CheckboxPageClient() {
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
          <CheckboxPattern />
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "checkbox.html", code: HTML_CODE },
                { label: "JS", filename: "checkbox.js", code: JS_CODE },
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
              <CheckboxPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <CheckboxPatternBroken />
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
              <li>Every checkbox in a group is individually focusable via Tab — there is no roving tabindex for checkboxes (unlike radio groups).</li>
              <li>Toggling a checkbox never moves focus away from it.</li>
              <li>A parent &quot;select all&quot; checkbox is never removed from the tab order, even while showing a mixed state.</li>
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

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
import { AlertDialogPattern } from "@/components/patterns/alert-dialog-pattern";
import { AlertDialogPatternBroken } from "@/components/patterns/alert-dialog-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("alert-dialog")!;

const HTML_CODE = `<button id="delete-trigger">Delete 12 items</button>

<!-- role="alertdialog" (not "dialog") tells AT this needs a decision;
     aria-describedby points at the consequence text. There is NO
     click-outside to close — the user must choose. Starts hidden. -->
<div id="alert-overlay" class="overlay" hidden>
  <div id="alert" role="alertdialog" aria-modal="true"
       aria-labelledby="alert-title" aria-describedby="alert-desc">
    <h2 id="alert-title">Delete 12 items?</h2>
    <p id="alert-desc">This can't be undone.</p>
    <button id="alert-cancel">Cancel</button>
    <button id="alert-confirm">Delete</button>
  </div>
</div>`;

const JS_CODE = `const trigger = document.getElementById("delete-trigger");
const overlay = document.getElementById("alert-overlay");
const dialog = document.getElementById("alert");
const cancelBtn = document.getElementById("alert-cancel");
const confirmBtn = document.getElementById("alert-confirm");
let lastFocused = null;

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function open() {
  lastFocused = document.activeElement;
  overlay.hidden = false;
  cancelBtn.focus(); // focus the LEAST destructive action — never "Delete"
  document.addEventListener("keydown", onKeyDown);
}

function close() {
  overlay.hidden = true;
  document.removeEventListener("keydown", onKeyDown);
  lastFocused?.focus();
}

function onKeyDown(e) {
  if (e.key === "Escape") { close(); return; } // Escape cancels
  if (e.key !== "Tab") return;
  // Focus trap — identical to the Dialog pattern.
  const f = [...dialog.querySelectorAll(FOCUSABLE)];
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

trigger.addEventListener("click", open);
cancelBtn.addEventListener("click", close);
confirmBtn.addEventListener("click", () => {
  // ...perform the destructive action...
  close();
});
// Note: intentionally NO backdrop-click handler — an alert dialog
// requires an explicit choice.`;

const ARIA_ROWS = [
  {
    target: "Dialog container",
    attribute: 'role="alertdialog"',
    why: "Distinct from role=\"dialog\" — tells AT this interruption carries urgent, often destructive, information requiring explicit acknowledgment.",
  },
  {
    target: "Dialog container",
    attribute: 'aria-modal="true"',
    why: "Same as Dialog: marks background content inert, backed by a manual focus trap.",
  },
  {
    target: "Dialog container",
    attribute: "aria-labelledby",
    why: "Points at the visible heading so the accessible name matches on-screen text.",
  },
  {
    target: "Dialog container",
    attribute: "aria-describedby",
    why: "Points at the consequence text (e.g. \"This can't be undone\") so it's read immediately after the name — critical context for a destructive confirmation.",
  },
  {
    target: "Cancel button",
    attribute: "Receives focus on open",
    why: "APG requirement specific to alertdialog: default focus goes to the least destructive action so accidental Enter/Space never confirms a destructive one.",
  },
];

const KEYBOARD_ROWS = [
  { keys: "Tab", behavior: "Moves focus to the next focusable element inside the dialog. Wraps from last to first." },
  { keys: "Shift+Tab", behavior: "Moves focus to the previous focusable element. Wraps from first to last." },
  { keys: "Escape", behavior: "Closes the dialog without taking the destructive action (equivalent to Cancel) and returns focus to the trigger." },
  { keys: "Enter / Space", behavior: "Activates whichever button has focus. Because focus starts on Cancel, this is safe by default." },
];

const SR_ROWS = [
  {
    step: "Alert dialog opens, focus moves to Cancel",
    jawsChrome: "Delete 12 items?, alert dialog, This can't be undone, button, Cancel",
    nvdaFirefox: "Delete 12 items?, alert dialog, This can't be undone, Cancel, button",
    voiceOverSafari: "Cancel, button, Delete 12 items?, alert dialog, This can't be undone",
  },
  {
    step: "Tab moves to the Delete button",
    jawsChrome: "Delete, button",
    nvdaFirefox: "Delete, button",
    voiceOverSafari: "Delete, button",
  },
  {
    step: "Escape pressed, dialog closes without deleting",
    jawsChrome: "Delete 12 items, button (focus restored to trigger)",
    nvdaFirefox: "Delete 12 items, button (focus restored to trigger)",
    voiceOverSafari: "Delete 12 items, button (focus restored to trigger)",
  },
];

const DEFECTS = [
  {
    defect: "role=\"dialog\" used instead of role=\"alertdialog\"",
    severity: "High" as const,
    description:
      "The popup is coded with role=\"dialog\", which some screen reader/browser pairings announce less assertively than alertdialog. Users may not register that this interruption is a critical, often irreversible, confirmation rather than routine dialog content. Fails 4.1.2 in spirit (incorrect role for the semantics conveyed).",
  },
  {
    defect: "Default focus lands on the destructive action, not Cancel",
    severity: "Critical" as const,
    description:
      "On open, focus moves to the \"Delete\" button instead of \"Cancel.\" A user who reflexively presses Enter — out of habit, or intending to dismiss what they assumed was a toast — confirms an irreversible destructive action by accident. This is the exact scenario the APG's least-destructive-action-gets-focus rule is designed to prevent. Fails SC 2.4.3 (Focus Order) in effect, and represents a serious usability/safety defect independent of any single SC.",
  },
  {
    defect: "Focus not trapped inside the alert dialog",
    severity: "Critical" as const,
    description:
      "Tab walks out of the dialog into background content while the overlay is still visually present. Fails SC 2.1.2 and 4.1.2.",
  },
  {
    defect: "Escape does not close the dialog",
    severity: "Medium" as const,
    description:
      "Keyboard-only users have no fast, unambiguous way to back out of a destructive confirmation without navigating to Cancel by Tab. Fails SC 2.1.1.",
  },
];

const TEST_STEPS = [
  { action: "Tab to the trigger (e.g. \"Delete 12 items\") and press Enter.", expected: "Alert dialog opens; focus visibly moves to the Cancel button, not the destructive Delete button." },
  { action: "Immediately press Enter without tabbing.", expected: "Because focus started on Cancel, the dialog closes WITHOUT deleting anything." },
  { action: "Reopen the dialog and press Tab.", expected: "Focus moves to the Delete button; focus never leaves the dialog even after tabbing past the last element." },
  { action: "Press Escape.", expected: "Dialog closes without performing the destructive action; focus returns to the trigger." },
  { action: "With a screen reader running, open the dialog.", expected: "The role is announced as \"alert dialog\" (not just \"dialog\"), immediately followed by the heading and consequence text." },
];

const CHECKLIST = [
  "Alert dialog can be opened and closed using only the keyboard.",
  "role=\"alertdialog\" (not role=\"dialog\") is present on the container.",
  "Default focus on open lands on the least destructive action (typically Cancel), never on the destructive/confirm action.",
  "Focus is trapped inside the dialog while open.",
  "Escape closes the dialog without performing the destructive action.",
  "Focus returns to the triggering element when the dialog closes, by any method.",
  "The dialog has an accessible name (aria-labelledby) and, where present, a description (aria-describedby) covering the consequence of confirming.",
  "Clicking outside the dialog (scrim) does not silently dismiss or confirm — confirm this is the intended behavior for a true alert dialog.",
];

export function AlertDialogPageClient() {
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
            role=&quot;alertdialog&quot;, focus trap, Escape handling, and
            focus forced to Cancel on open.
          </p>
          <AlertDialogPattern
            triggerLabel="Delete 12 items"
            title="Delete 12 items?"
            description="This action can't be undone."
          />
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "alert-dialog.html", code: HTML_CODE },
                { label: "JS", filename: "alert-dialog.js", code: JS_CODE },
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
              <AlertDialogPattern
                triggerLabel="Delete 12 items"
                title="Delete 12 items?"
                description="This action can't be undone."
              />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <AlertDialogPatternBroken triggerLabel="Delete 12 items" title="Delete 12 items?" />
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
              <li>On open: focus moves to the least destructive action (typically Cancel) — never to the confirm/destroy button.</li>
              <li>While open: Tab/Shift+Tab cycle only within the dialog&apos;s focusable elements.</li>
              <li>On close (Escape, confirm, or cancel): focus returns to the element that opened the dialog.</li>
              <li>Unlike a plain Dialog, clicking the scrim/overlay does not close a true alert dialog — the interruption should be resolved deliberately, not brushed aside accidentally.</li>
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

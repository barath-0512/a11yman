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
import { DialogPattern } from "@/components/patterns/dialog-pattern";
import { DialogPatternBroken } from "@/components/patterns/dialog-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("dialog")!;

const HTML_CODE = `<button id="dialog-trigger">Edit profile</button>

<!-- Modal dialog: role="dialog" + aria-modal="true" + aria-labelledby
     (the title). Starts hidden. Tip: a native <dialog> opened with
     showModal() gives you the focus trap, Escape, and an inert
     background for free — this manual version shows what that does. -->
<div id="dialog-overlay" class="overlay" hidden>
  <div id="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <h2 id="dialog-title">Edit profile</h2>
    <button id="dialog-close" aria-label="Close">×</button>
    <!-- dialog content / form fields -->
  </div>
</div>`;

const JS_CODE = `const trigger = document.getElementById("dialog-trigger");
const overlay = document.getElementById("dialog-overlay");
const dialog = document.getElementById("dialog");
const closeBtn = document.getElementById("dialog-close");
let lastFocused = null;

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function open() {
  lastFocused = document.activeElement; // remember what to restore later
  overlay.hidden = false;
  closeBtn.focus();                     // move focus INTO the dialog
  document.addEventListener("keydown", onKeyDown);
}

function close() {
  overlay.hidden = true;
  document.removeEventListener("keydown", onKeyDown);
  lastFocused?.focus();                 // restore focus to the trigger
}

function onKeyDown(e) {
  if (e.key === "Escape") { close(); return; }
  if (e.key !== "Tab") return;

  // Manual focus trap: keep Tab / Shift+Tab cycling inside the dialog
  // so focus can never reach the inert page behind it.
  const focusables = [...dialog.querySelectorAll(FOCUSABLE)];
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

trigger.addEventListener("click", open);
closeBtn.addEventListener("click", close);
// Clicking the backdrop (but not the dialog itself) closes it.
overlay.addEventListener("mousedown", (e) => {
  if (e.target === overlay) close();
});`;

const ARIA_ROWS = [
  {
    target: "Dialog container",
    attribute: 'role="dialog"',
    why: "Identifies the element as a dialog so AT announces \"dialog\" and switches some screen readers into a more linear reading mode.",
  },
  {
    target: "Dialog container",
    attribute: 'aria-modal="true"',
    why: "Signals that content outside the dialog is inert. Combined with — not a replacement for — a real focus trap.",
  },
  {
    target: "Dialog container",
    attribute: "aria-labelledby",
    why: "Points at the visible heading so the dialog's accessible name matches what's on screen (SC 2.5.3 Label in Name).",
  },
  {
    target: "Dialog container",
    attribute: "aria-describedby",
    why: "Optionally points at supporting body text so it's announced right after the name/role on open.",
  },
  {
    target: "Close button",
    attribute: 'aria-label="Close dialog"',
    why: "An icon-only close button has no accessible name from its text content, so one must be supplied explicitly.",
  },
];

const KEYBOARD_ROWS = [
  { keys: "Tab", behavior: "Moves focus to the next focusable element inside the dialog. Wraps from the last to the first (focus trap)." },
  { keys: "Shift+Tab", behavior: "Moves focus to the previous focusable element inside the dialog. Wraps from the first to the last." },
  { keys: "Escape", behavior: "Closes the dialog and returns focus to the triggering element." },
  { keys: "Enter / Space", behavior: "Activates the focused button (native behavior, no custom handling needed)." },
];

const SR_ROWS = [
  {
    step: "Dialog opens, focus moves to the close button",
    jawsChrome: "Delete file, dialog, button, Close dialog",
    nvdaFirefox: "Delete file, dialog, Close dialog, button",
    voiceOverSafari: "Close dialog, button, Delete file, dialog",
  },
  {
    step: "Tabbing past the last focusable element",
    jawsChrome: "Close dialog, button (focus wraps, no page content announced)",
    nvdaFirefox: "Close dialog, button (focus wraps, no page content announced)",
    voiceOverSafari: "Close dialog, button (focus wraps, no page content announced)",
  },
  {
    step: "Escape pressed, dialog closes",
    jawsChrome: "Open dialog, button (focus restored to trigger)",
    nvdaFirefox: "Open dialog, button (focus restored to trigger)",
    voiceOverSafari: "Open dialog, button (focus restored to trigger)",
  },
];

const DEFECTS = [
  {
    defect: "Focus not trapped — Tab escapes to background content",
    severity: "Critical" as const,
    description:
      "With the dialog open, pressing Tab repeatedly moves focus onto elements behind the overlay. Keyboard users can interact with a page that is visually blocked, and screen reader users lose their place entirely. Fails SC 2.1.2 and 4.1.2.",
  },
  {
    defect: "Focus not moved into the dialog on open",
    severity: "High" as const,
    description:
      "When the dialog opens, focus remains on the trigger button (now hidden behind the overlay) or resets to <body>. Screen reader users are not told a dialog opened. Fails SC 2.4.3 and 4.1.2.",
  },
  {
    defect: "Focus not restored to the trigger on close",
    severity: "High" as const,
    description:
      "Closing the dialog leaves focus on <body> (or wherever the close control happened to be removed from), forcing keyboard users to re-navigate the whole page to find their place. Fails SC 2.4.3.",
  },
  {
    defect: "Missing role=\"dialog\" / aria-modal",
    severity: "Critical" as const,
    description:
      "The overlay is implemented with plain <div>s and no ARIA. Screen readers announce it as ordinary page content, so users don't know an interruption occurred and can't tell what's now the primary context. Fails SC 4.1.2.",
  },
  {
    defect: "Escape key does not close the dialog",
    severity: "Medium" as const,
    description:
      "There is no keyboard equivalent for dismissing the dialog other than tabbing to a close button, which may not exist or may be hard to reach. Fails SC 2.1.1.",
  },
];

const TEST_STEPS = [
  { action: "Tab to the trigger button and press Enter or Space.", expected: "Dialog opens; focus visibly moves inside it, typically to the first focusable element or the close button." },
  { action: "Press Tab repeatedly through every focusable element in the dialog.", expected: "Focus cycles only within the dialog; after the last element, it wraps to the first. Nothing behind the overlay ever receives focus." },
  { action: "Press Shift+Tab from the first focusable element.", expected: "Focus wraps to the last focusable element in the dialog." },
  { action: "Press Escape.", expected: "Dialog closes and focus returns to the button that opened it." },
  { action: "Reopen the dialog, then click outside it (on the scrim).", expected: "Dialog closes (if this is the intended behavior for this instance) or the click is ignored — confirm which is documented for this dialog." },
  { action: "With a screen reader running, open the dialog.", expected: "The dialog's name and role are announced (e.g. \"Delete file, dialog\") immediately when focus enters it." },
];

const CHECKLIST = [
  "Dialog can be opened and closed using only the keyboard.",
  "Focus moves into the dialog when it opens.",
  "Focus is trapped inside the dialog while open (Tab and Shift+Tab never reach background content).",
  "Escape closes the dialog.",
  "Focus returns to the triggering element when the dialog closes.",
  "The dialog has role=\"dialog\" (or is a native <dialog> opened with showModal()) and aria-modal=\"true\".",
  "The dialog has an accessible name via aria-labelledby matching the visible heading.",
  "Background content is not announced or reachable by screen reader virtual cursor while the dialog is open.",
  "Dialog is usable and text does not overflow/clip at 200% browser zoom.",
  "Close button (and all interactive elements) meet the 24x24 CSS pixel minimum target size.",
];

export function DialogPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Overlays</Badge>
          <Badge tone="neutral">Flagship guide</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">
          Accessible {meta.name}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {meta.definition}
        </p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Focus trap via Tab/Shift+Tab interception, Escape handling, and
            explicit focus restoration.
          </p>
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "dialog.html", code: HTML_CODE },
                { label: "JS", filename: "dialog.js", code: JS_CODE },
              ]}
            />
          )}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="flex flex-wrap gap-4 rounded-2xl border border-border bg-card p-6">
              <DialogPattern
                triggerLabel="Open custom dialog"
                title="Delete file?"
                description="This action can't be undone."
              />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <DialogPatternBroken triggerLabel="Open broken dialog" title="Delete file?" />
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
              <li>On open: focus moves to the first focusable element inside the dialog (here, the close button).</li>
              <li>While open: Tab/Shift+Tab cycle only within the dialog's focusable elements.</li>
              <li>On close (Escape, confirm, cancel, or scrim click): focus returns to the element that opened the dialog.</li>
              <li>If the trigger element no longer exists after close (e.g. it was in a list row that got deleted), move focus to the next logical element — never let it fall back to &lt;body&gt;.</li>
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

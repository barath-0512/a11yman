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
import { ToastPattern } from "@/components/patterns/toast-pattern";
import { ToastPatternBroken } from "@/components/patterns/toast-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("toast")!;

const HTML_CODE = `<button id="save-btn">Show success toast</button>

<!-- This live region exists BEFORE any message does — many screen
     readers only announce live-region content if the region was already
     in the DOM when the text changes. Keep it always present + empty. -->
<div id="toast-live" role="status" aria-live="polite" class="sr-only"></div>

<!-- The visible toast is separate from the live region. Hidden until shown. -->
<div id="toast" class="toast" hidden>
  <p id="toast-msg"></p>
  <button id="toast-dismiss">Dismiss</button>
</div>`;

const JS_CODE = `const trigger = document.getElementById("save-btn");
const live = document.getElementById("toast-live");
const toast = document.getElementById("toast");
const message = document.getElementById("toast-msg");
const dismissBtn = document.getElementById("toast-dismiss");
let hideTimer;

function show(text) {
  message.textContent = text;
  toast.hidden = false;
  live.textContent = text; // updating the pre-existing region announces it
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hide, 4000); // auto-dismiss (keep it generous)
}

function hide() {
  toast.hidden = true;
  live.textContent = ""; // clear so an identical message can announce again
}

trigger.addEventListener("click", () => show("Changes saved successfully."));
dismissBtn.addEventListener("click", hide);`;

const ARIA_ROWS = [
  {
    target: "Live region container",
    attribute: 'role="status" (implicit aria-live="polite")',
    why: "Announces routine, non-urgent confirmations without interrupting whatever the user is currently doing or reading.",
  },
  {
    target: "Live region container (urgent variant)",
    attribute: 'role="alert" (implicit aria-live="assertive")',
    why: "Reserve for genuinely urgent/error toasts — assertive announcements interrupt the screen reader's current speech, which is disruptive if overused.",
  },
  {
    target: "Live region container",
    attribute: "Mounted persistently, content swapped via state",
    why: "The region must already exist in the DOM before text is injected — mounting the container and its content in the same paint means many AT never \"discover\" the region in time to announce it.",
  },
  {
    target: "Dismiss control (if present)",
    attribute: 'aria-label="Dismiss notification"',
    why: "An icon-only or terse dismiss control needs an explicit accessible name distinguishing it from other Dismiss/Close controls on the page.",
  },
];

const KEYBOARD_ROWS = [
  { keys: "(none — toast never receives focus)", behavior: "A toast must never steal keyboard focus from whatever the user was doing when it appeared." },
  { keys: "Tab (to reach an optional Dismiss button)", behavior: "If a toast includes a dismiss control, it should be reachable in the natural tab order, not force-focused." },
  { keys: "Enter / Space (on Dismiss)", behavior: "Dismisses the toast early, before its auto-dismiss timer elapses." },
];

const SR_ROWS = [
  {
    step: "Toast appears (role=\"status\")",
    jawsChrome: "Changes saved successfully.",
    nvdaFirefox: "Changes saved successfully.",
    voiceOverSafari: "Changes saved successfully.",
  },
  {
    step: "Toast appears (role=\"alert\", urgent variant)",
    jawsChrome: "Alert! Could not save changes. Try again.",
    nvdaFirefox: "Could not save changes. Try again.",
    voiceOverSafari: "Could not save changes. Try again.",
  },
  {
    step: "User keeps typing in a form field while toast appears",
    jawsChrome: "(form field content continues uninterrupted; toast announced separately once a pause allows it)",
    nvdaFirefox: "(form field content continues uninterrupted; toast announced separately once a pause allows it)",
    voiceOverSafari: "(form field content continues uninterrupted; toast announced separately once a pause allows it)",
  },
];

const DEFECTS = [
  {
    defect: "No aria-live / role on the message container",
    severity: "Critical" as const,
    description:
      "The confirmation text is inserted as plain, non-live DOM content. Sighted users see it; screen reader users using a virtual cursor elsewhere on the page never hear it and have no idea their action succeeded (or failed). Fails SC 4.1.3 Status Messages.",
  },
  {
    defect: "Live region mounted and filled in the same paint",
    severity: "High" as const,
    description:
      "The role=\"status\" container is only added to the DOM at the same moment the message text appears (conditional render wraps both together). Several screen reader/browser combinations require the live region to already exist before content changes inside it to reliably announce the change — intermittently, the toast is silently missed. Fails SC 4.1.3.",
  },
  {
    defect: "Auto-dismiss timer far too short",
    severity: "High" as const,
    description:
      "The toast removes itself after well under a second. Screen readers that do pick up the announcement often don't finish speaking before the node is removed, and sighted users report messages \"flashing\" past before they can read them.",
  },
  {
    defect: "Toast steals keyboard focus on appearance",
    severity: "Medium" as const,
    description:
      "Focus is force-moved to the toast when it appears, interrupting whatever the user was doing (e.g. mid-typing in a form). Toasts are non-modal by definition and must never do this.",
  },
];

const TEST_STEPS = [
  { action: "With a screen reader running, click \"Show success toast.\"", expected: "The confirmation message is announced without moving screen reader focus away from wherever it currently is." },
  { action: "Trigger the toast, then immediately continue typing in an unrelated text field.", expected: "Typing is uninterrupted; the toast announcement does not steal keyboard focus." },
  { action: "Time how long the toast remains visible/announced.", expected: "The message stays on screen long enough to be read in full (several seconds), not a sub-second flash." },
  { action: "Inspect the DOM while no toast is showing.", expected: "The aria-live container element is already present in the markup (e.g. an empty role=\"status\" node), not absent until a message appears." },
  { action: "If a Dismiss control is present, activate it with the keyboard.", expected: "The toast is removed early without affecting focus elsewhere on the page." },
];

const CHECKLIST = [
  "Toast message container has role=\"status\" (routine) or role=\"alert\" (urgent) or an equivalent aria-live attribute.",
  "The live-region container exists in the DOM before message text is inserted into it, not mounted together with the first message.",
  "Toast never receives or steals keyboard focus when it appears.",
  "Toast is not the only way critical information is conveyed — errors that block progress also surface inline near the relevant control.",
  "Auto-dismiss duration gives users realistically enough time to read the message (several seconds, not under 1-2s).",
  "If present, a Dismiss control is keyboard-operable and has a clear accessible name.",
  "Multiple simultaneous toasts (if supported) don't cause announcements to overlap/clobber each other.",
];

export function ToastPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Feedback</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Persistent live region, auto-dismiss after 4s, manual Dismiss
            control, non-modal (never steals focus).
          </p>
          <ToastPattern />
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "toast.html", code: HTML_CODE },
                { label: "JS", filename: "toast.js", code: JS_CODE },
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
              <ToastPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <ToastPatternBroken />
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
              <li>A toast never receives focus on appearance and never traps focus — it is non-modal by definition.</li>
              <li>The live-region container is mounted once, persistently, for the lifetime of the page; only its text content changes.</li>
              <li>If a Dismiss control exists, it sits in the natural tab order near where the toast renders, not force-focused.</li>
              <li>Dismissing (manually or via timeout) does not move focus anywhere — the user's focus was never disturbed in the first place.</li>
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

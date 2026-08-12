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
import { ComboboxPattern } from "@/components/patterns/combobox-pattern";
import { ComboboxPatternBroken } from "@/components/patterns/combobox-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("combobox")!;

const HTML_CODE = `<label for="fruit">Choose a fruit</label>

<!-- Editable combobox. aria-expanded reflects the popup; aria-controls
     points at the listbox; aria-autocomplete="list" says suggestions
     appear as you type. aria-activedescendant (set from JS) highlights
     an option WITHOUT moving DOM focus off the input — so the caret and
     the screen reader's "edit text" mode are preserved. -->
<input
  id="fruit"
  role="combobox"
  aria-expanded="false"
  aria-controls="fruit-listbox"
  aria-autocomplete="list"
  autocomplete="off"
/>

<ul id="fruit-listbox" role="listbox" aria-label="Fruits" hidden></ul>`;

const JS_CODE = `const FRUITS = ["Apple", "Apricot", "Banana", "Cherry", "Grape", "Mango"];
const input = document.getElementById("fruit");
const listbox = document.getElementById("fruit-listbox");
let matches = [];
let activeIndex = -1;

function open() {
  input.setAttribute("aria-expanded", "true");
  listbox.hidden = false;
}

function close() {
  input.setAttribute("aria-expanded", "false");
  listbox.hidden = true;
  activeIndex = -1;
  input.removeAttribute("aria-activedescendant");
}

function renderOptions() {
  matches = FRUITS.filter((f) =>
    f.toLowerCase().includes(input.value.toLowerCase())
  );
  listbox.replaceChildren(
    ...matches.map((fruit, i) => {
      const li = document.createElement("li");
      li.id = "fruit-option-" + i;
      li.setAttribute("role", "option");
      li.textContent = fruit;
      // mousedown, not click, so the input doesn't blur first.
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        select(i);
      });
      return li;
    })
  );
}

function highlight(i) {
  activeIndex = i;
  [...listbox.children].forEach((li, idx) =>
    li.setAttribute("aria-selected", String(idx === i))
  );
  // Virtual focus: point at the option; real DOM focus stays in the input.
  input.setAttribute("aria-activedescendant", "fruit-option-" + i);
}

function select(i) {
  input.value = matches[i];
  close();
  input.focus(); // focus never leaves the input
}

input.addEventListener("input", () => {
  renderOptions();
  matches.length ? open() : close();
});

input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    open();
    highlight(Math.min(activeIndex + 1, matches.length - 1));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    highlight(Math.max(activeIndex - 1, 0));
  } else if (e.key === "Enter" && activeIndex >= 0) {
    e.preventDefault();
    select(activeIndex);
  } else if (e.key === "Escape") {
    close();
  }
});`;

const ARIA_ROWS = [
  { target: "Text input", attribute: 'role="combobox"', why: 'Identifies the input as a combobox, not a plain textbox, so AT announces "combobox" and exposes expand/collapse state.' },
  { target: "Text input", attribute: "aria-expanded", why: "Tells AT whether the suggestion popup is currently open — announced as \"collapsed\" or \"expanded.\"" },
  { target: "Text input", attribute: "aria-controls", why: "Associates the input with the popup listbox it controls, by id." },
  { target: "Text input", attribute: 'aria-autocomplete="list"', why: "Tells AT that typing produces a filtered list of suggestions (as opposed to inline text completion)." },
  { target: "Text input", attribute: "aria-activedescendant", why: "Points at the id of the currently-highlighted option while DOM focus stays on the input, so the caret and screen reader cursor never leave the edit field." },
  { target: "Popup list", attribute: 'role="listbox"', why: "Identifies the popup as a list of selectable options." },
  { target: "Each option", attribute: 'role="option" + aria-selected', why: "Identifies each row as selectable and communicates which one is currently active." },
];

const KEYBOARD_ROWS = [
  { keys: "Down Arrow", behavior: "Opens the popup if closed; otherwise moves the active option to the next item." },
  { keys: "Up Arrow", behavior: "Moves the active option to the previous item." },
  { keys: "Enter", behavior: "Commits the active option's value into the input and closes the popup." },
  { keys: "Escape", behavior: "Closes the popup without changing the input value." },
  { keys: "Home / End", behavior: "Moves the active option to the first / last item in the popup." },
  { keys: "Printable characters", behavior: "Filters the option list; popup opens automatically." },
];

const SR_ROWS = [
  { step: "Input receives focus, popup closed", jawsChrome: "Fruit, combobox, edit text", nvdaFirefox: "Fruit, edit, combobox, collapsed", voiceOverSafari: "Fruit, text field, combobox, collapsed" },
  { step: "User types \"ap\", popup opens", jawsChrome: "Expanded, ap, list with 2 items", nvdaFirefox: "ap, expanded, Apple, 1 of 2", voiceOverSafari: "ap, list box expanded" },
  { step: "Arrow Down to first option", jawsChrome: "Apple, 1 of 2", nvdaFirefox: "Apple, 1 of 2", voiceOverSafari: "Apple, 1 of 2" },
  { step: "Enter commits the option", jawsChrome: "Apple, collapsed", nvdaFirefox: "Apple, collapsed", voiceOverSafari: "Apple, collapsed" },
];

const DEFECTS = [
  { defect: "Suggestions only reachable by mouse hover", severity: "Critical" as const, description: "Keyboard-only users cannot access the suggestion list at all — there is no arrow-key path to any option. Fails SC 2.1.1 Keyboard." },
  { defect: "Missing aria-expanded / aria-activedescendant", severity: "High" as const, description: "Screen reader users are not told the combobox has a popup, or which option is currently highlighted while typing. Fails SC 4.1.2 Name, Role, Value." },
  { defect: "DOM focus moves onto option elements instead of using aria-activedescendant", severity: "Medium" as const, description: "Moving real focus into the popup breaks continued typing/filtering and can cause the screen reader to exit edit-field context unexpectedly. Fails SC 4.1.2." },
  { defect: "Popup does not close on Escape or outside click", severity: "Medium" as const, description: "Users have no reliable way to dismiss the suggestion list once open, cluttering the reading order for screen reader users. Fails SC 2.1.1." },
];

const TEST_STEPS = [
  { action: "Tab to the combobox input.", expected: "Screen reader announces the label, role \"combobox,\" and collapsed state." },
  { action: "Type a partial match, e.g. \"ap\".", expected: "Popup opens; screen reader announces expanded state and the number of matching options." },
  { action: "Press Down Arrow.", expected: "First option is highlighted and announced, without focus leaving the input (you can still edit the text)." },
  { action: "Continue pressing Down Arrow through all options, then Up Arrow back.", expected: "Highlight moves in both directions; wrapping behavior (if any) is documented and consistent." },
  { action: "Press Enter on a highlighted option.", expected: "Option value fills the input; popup closes; focus remains on the input." },
  { action: "Reopen the popup and press Escape.", expected: "Popup closes without changing the input's current value; focus remains on the input." },
];

const CHECKLIST = [
  "Popup can be opened, navigated, and an option committed using only the keyboard.",
  "aria-expanded reflects the popup's actual open/closed state at all times.",
  "aria-activedescendant is set to the currently highlighted option's id and updates as arrow keys are pressed.",
  "DOM focus remains on the text input the entire time (never moves into the popup).",
  "Escape closes the popup without altering the current input value.",
  "Enter on a highlighted option commits its value and closes the popup.",
  "Typing filters the option list and reopens the popup if it was closed.",
  "All options are announced with their position (e.g. \"1 of 6\") by at least one screen reader tested.",
];

export function ComboboxPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Forms &amp; Controls</Badge>
          <Badge tone="neutral">Flagship guide</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Accessible {meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <ComboboxPattern />
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "combobox.html", code: HTML_CODE },
                { label: "JS", filename: "combobox.js", code: JS_CODE },
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
              <ComboboxPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <ComboboxPatternBroken />
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
              <li>DOM focus stays on the text input at all times — never moves into the popup.</li>
              <li>The active option is communicated via aria-activedescendant, not real focus.</li>
              <li>Selecting an option (mouse or keyboard) returns focus to the input immediately.</li>
              <li>Closing the popup (Escape or outside click) never moves focus away from the input.</li>
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
